import * as D from "@mojotech/json-type-validation";
import { Art } from "models/art";
import { Firestore, Storage } from "server-libs/firebase";

/*
 * =======================
 * queryPublicArtsOfArtist
 * =======================
 */
export const queryPublicArtsOfArtist = async (
  artistUid: string
): Promise<Art[]> => {
  // firestoreからデータを取得する
  const docs = await Firestore.shared.queryManyWhere(
    `artists/${artistUid}/arts`,
    "showPublic",
    "==",
    true
  );

  return docs.map((doc) => {
    const thumbnailUrl = Storage.shared.getPublicUrl(
      `artists/${artistUid}/arts/${doc.id}/sumbnail.jpg`
    );

    return {
      id: doc.id,
      ...ArtDocumentDecoder.runWithException(doc.data()),
      thumbnailUrl,
    };
  });
};

/*
 * ====================
 * queryAllArtsOfArtist
 * ====================
 */
export const queryAllArtsOfArtist = async (
  artistUid: string
): Promise<Art[]> => {
  // firestoreからデータを取得する
  const docs = await Firestore.shared.queryMany(`artists/${artistUid}/arts`);

  return await Promise.all(
    docs.map(async (doc) => {
      const thumbnailUrl = await Storage.shared.getSignedUrl(
        `artists/${artistUid}/arts/${doc.id}/sumbnail.jpg`
      );

      return {
        id: doc.id,
        ...ArtDocumentDecoder.runWithException(doc.data()),
        thumbnailUrl,
      };
    })
  );
};

/*
 * ===============
 * queryPrivateArtById
 * ===============
 */
export const queryPrivateArtById = async (
  artistUid: string,
  artId: string
): Promise<Art | null> => {
  // firestoreからデータを取得する
  const doc = await Firestore.shared.query(
    `artists/${artistUid}/arts/${artId}`
  );
  if (!doc) return null;
  const decoded = ArtDocumentDecoder.runWithException(doc.data());

  // storageから画像を取得する
  const thumbnailUrl = await Storage.shared.getSignedUrl(
    `artists/${artistUid}/arts/${artId}/sumbnail.jpg`
  );

  return {
    id: artId,
    ...decoded,
    thumbnailUrl,
  };
};

/*
 * =============
 * createArt
 * =============
 */
export type CreateArtArgs = {
  artistUid: string;
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
  thumbnailData: Buffer;
};

export const createArt = async (args: CreateArtArgs): Promise<string> => {
  // firestoreにdocumentを追加
  const artId = await Firestore.shared.create(
    `artists/${args.artistUid}/arts`,
    {
      title: args.title,
      widthMM: args.widthMM,
      heightMM: args.heightMM,
      description: args.description,
      materials: args.materials,
      showPublic: args.showPublic,
      salesPriceYen: args.salesPriceYen,
      rentalPriceYen: args.rentalPriceYen,
    }
  );

  // storageにサムネイルを追加
  await Storage.shared.save(
    `artists/${args.artistUid}/arts/${artId}/sumbnail.jpg`,
    args.thumbnailData,
    {
      contentType: "image/jpeg",
      accessControl: args.showPublic ? "publicRead" : "private",
    }
  );

  return artId;
};

/*
 * =============
 * updateArt
 * =============
 */
export type UpdateArtArgs = {
  artistUid: string;
  id: string;
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
  thumbnailData: Buffer | null;
};

export const updateArt = async (args: UpdateArtArgs): Promise<void> => {
  const promises = [];

  // firestoreの情報の更新
  promises.push(
    Firestore.shared.update(`artists/${args.artistUid}/arts/${args.id}`, {
      title: args.title,
      widthMM: args.widthMM,
      heightMM: args.heightMM,
      description: args.description,
      materials: args.materials,
      showPublic: args.showPublic,
      salesPriceYen: args.salesPriceYen,
      rentalPriceYen: args.rentalPriceYen,
    })
  );

  // サムネイルの更新
  if (args.thumbnailData) {
    promises.push(
      Storage.shared.save(
        `artists/${args.artistUid}/arts/${args.id}/sumbnail.jpg`,
        args.thumbnailData,
        {
          contentType: "image/jpeg",
          accessControl: "private",
        }
      )
    );
  }

  // サムネイルの可視性の更新
  const file = `artists/${args.artistUid}/arts/${args.id}/sumbnail.jpg`;
  if (args.showPublic) {
    promises.push(Storage.shared.makePublic(file));
  } else {
    promises.push(Storage.shared.makePrivate(file));
  }

  await Promise.all(promises);
};

/*
 * ===========
 * deleteArt
 * ===========
 */
export const deleteArt = async (
  artistUid: string,
  artId: string
): Promise<void> => {
  await Firestore.shared.delete(`artists/${artistUid}/arts/${artId}`);

  await Storage.shared.delete(
    `artists/${artistUid}/arts/${artId}/sumbnail.jpg`
  );
};

/*
 * ===================
 * Interface & Decoder
 * ===================
 */
interface ArtDocument {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
}

const ArtDocumentDecoder: D.Decoder<ArtDocument> = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  showPublic: D.boolean(),
  salesPriceYen: D.optional(D.number()),
  rentalPriceYen: D.optional(D.number()),
});
