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
      `artists/${artistUid}/arts/${doc.id}/original.webp`
    );

    return {
      id: doc.id,
      ...toNewArtDoc(ArtDocumentDecoder.runWithException(doc.data())),
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
        `artists/${artistUid}/arts/${doc.id}/original.webp`
      );

      return {
        id: doc.id,
        ...toNewArtDoc(ArtDocumentDecoder.runWithException(doc.data())),
        thumbnailUrl,
      };
    })
  );
};

/*
 * ===============
 * queryArtById
 * ===============
 */
export const queryArtById = async (
  artistUid: string,
  artId: string
): Promise<Art | null> => {
  const doc = await Firestore.shared.query(
    `artists/${artistUid}/arts/${artId}`
  );
  if (!doc) return null;
  const decoded = toNewArtDoc(ArtDocumentDecoder.runWithException(doc.data()));

  const thumbnailUrl = await Storage.shared.getPublicUrl(
    `artists/${artistUid}/arts/${artId}/original.webp`
  );

  return {
    id: doc.id,
    ...decoded,
    thumbnailUrl,
  };
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
  const decoded = toNewArtDoc(ArtDocumentDecoder.runWithException(doc.data()));

  // storageから画像を取得する
  const thumbnailUrl = await Storage.shared.getSignedUrl(
    `artists/${artistUid}/arts/${artId}/original.webp`
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
  salesPriceYen: number | null;
  rentalPriceYen: number | null;
  thumbnailData: Buffer;
};

export const createArt = async (args: CreateArtArgs): Promise<string> => {
  // firestoreにdocumentを追加
  const artId = await Firestore.shared.add(`artists/${args.artistUid}/arts`, {
    title: args.title,
    widthMM: args.widthMM,
    heightMM: args.heightMM,
    description: args.description,
    materials: args.materials,
    showPublic: args.showPublic,
    salesPriceYen: args.salesPriceYen,
    rentalPriceYen: args.rentalPriceYen,
  });

  // storageにサムネイルを追加
  await Storage.shared.save(
    `artists/${args.artistUid}/arts/${artId}/original.webp`,
    args.thumbnailData,
    {
      contentType: "image/webp",
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
  salesPriceYen: number | null;
  rentalPriceYen: number | null;
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
        `artists/${args.artistUid}/arts/${args.id}/original.webp`,
        args.thumbnailData,
        {
          contentType: "image/webp",
          accessControl: "private",
        }
      )
    );
  }

  // サムネイルの可視性の更新
  const file = `artists/${args.artistUid}/arts/${args.id}/original.webp`;
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
    `artists/${artistUid}/arts/${artId}/original.webp`
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
  salesPriceYen?: number | null;
  rentalPriceYen?: number | null;
}

const ArtDocumentDecoder: D.Decoder<ArtDocument> = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  showPublic: D.boolean(),
  salesPriceYen: D.optional(D.union(D.number(), D.constant(null))),
  rentalPriceYen: D.optional(D.union(D.number(), D.constant(null))),
});

type NewArtDocument = {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen: number | null;
  rentalPriceYen: number | null;
};

const toNewArtDoc = (old: ArtDocument): NewArtDocument => ({
  title: old.title,
  widthMM: old.widthMM,
  heightMM: old.heightMM,
  description: old.description,
  materials: old.materials,
  showPublic: old.showPublic,
  salesPriceYen: old.salesPriceYen ?? null,
  rentalPriceYen: old.rentalPriceYen ?? null,
});
