import { app, firestore } from "firebase-admin";
import * as D from "@mojotech/json-type-validation";
import { Art } from "models/art";
import { getFirebaseAdmin } from "server-libs/firebase";

const BUCKET_NAME = "artell-portfolio.appspot.com";

/*
 * =======================
 * queryPublicArtsOfArtist
 * =======================
 */
export const queryPublicArtsOfArtist = async (
  artistUid: string,
  admin: app.App
): Promise<Art[]> => {
  // firestoreからデータを取得する
  const collection = await admin
    .firestore()
    .collection(`artists/${artistUid}/arts`)
    .where("showPublic", "==", true)
    .get();

  const bucket = admin.storage().bucket("artell-portfolio.appspot.com");

  return collection.docs.map((doc) => {
    const file = bucket.file(
      `artists/${artistUid}/arts/${doc.id}/sumbnail.jpg`
    );
    // TODO
    // fileのupload時にshowPublicならmakePublicする
    file.makePublic();

    return {
      id: doc.id,
      ...ArtDocumentDecoder.runWithException(doc.data()),
      thumbnailUrl: file.publicUrl(),
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
  const admin = getFirebaseAdmin();

  // firestoreからデータを取得する
  const collection = await admin
    .firestore()
    .collection(`artists/${artistUid}/arts`)
    .get();

  const bucket = admin.storage().bucket(BUCKET_NAME);

  return await Promise.all(
    collection.docs.map(async (doc) => {
      const file = bucket.file(
        `artists/${artistUid}/arts/${doc.id}/sumbnail.jpg`
      );

      // fileの中にはprivateなものも含まれるので、
      // 制限付きのURLを取得する
      const [thumbnailUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60, // 1 hour
      });

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
  const admin = getFirebaseAdmin();

  // firestoreからデータを取得する
  const doc = await admin
    .firestore()
    .doc(`artists/${artistUid}/arts/${artId}`)
    .get();
  const data = doc.data();
  if (!data) {
    return null;
  }
  const decoded = ArtDocumentDecoder.runWithException(data);

  // storageから画像を取得する
  const file = admin
    .storage()
    .bucket(BUCKET_NAME)
    .file(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`);

  // fileはprivateである可能性もあるので、
  // 制限付きのURLを取得する
  const [thumbnailUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

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
  const admin = getFirebaseAdmin();

  // firestoreにdocumentを追加
  const doc = await admin
    .firestore()
    .collection(`artists/${args.artistUid}/arts`)
    .add(
      formatAddData({
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

  const artId = doc.id;

  // storageにサムネイルを追加
  await admin
    .storage()
    .bucket(BUCKET_NAME)
    .file(`artists/${args.artistUid}/arts/${artId}/sumbnail.jpg`)
    .save(args.thumbnailData, {
      contentType: "image/jpeg",
      resumable: false,
      // https://googleapis.dev/nodejs/storage/latest/global.html#CreateWriteStreamOptions
      predefinedAcl: args.showPublic ? "publicRead" : "private",
    });

  return artId;
};

// "undefined" な値を取り除く
const formatAddData = (doc: ArtDocument): ArtDocument => {
  let key: keyof ArtDocument;
  for (key in doc) {
    if (doc[key] === undefined) {
      delete doc[key];
    }
  }

  return doc;
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
  const admin = getFirebaseAdmin();

  let promises = [];

  // firestoreの情報の更新
  promises.push(
    admin
      .firestore()
      .doc(`artists/${args.artistUid}/arts/${args.id}`)
      .update(
        formatUpdateData({
          title: args.title,
          widthMM: args.widthMM,
          heightMM: args.heightMM,
          description: args.description,
          materials: args.materials,
          showPublic: args.showPublic,
          salesPriceYen: args.salesPriceYen,
          rentalPriceYen: args.rentalPriceYen,
        })
      )
      .then(() => undefined)
  );

  // サムネイルの更新
  if (args.thumbnailData) {
    promises.push(
      admin
        .storage()
        .bucket(BUCKET_NAME)
        .file(`artists/${args.artistUid}/arts/${args.id}/sumbnail.jpg`)
        .save(args.thumbnailData, {
          contentType: "image/jpeg",
          resumable: false,
        })
    );
  }

  // サムネイルの可視性の更新
  const file = admin
    .storage()
    .bucket(BUCKET_NAME)
    .file(`artists/${args.artistUid}/arts/${args.id}/sumbnail.jpg`);
  if (args.showPublic) {
    promises.push(file.makePublic().then(() => undefined));
  } else {
    promises.push(file.makePrivate().then(() => undefined));
  }

  await Promise.all(promises);
};

const formatUpdateData = (doc: ArtDocument): { [key: string]: unknown } => {
  const formatted: { [key: string]: unknown } = {};

  Object.entries(doc).forEach(([key, val]) => {
    if (val === undefined || val === null) {
      formatted[key] = firestore.FieldValue.delete();
    } else {
      formatted[key] = val;
    }
  });

  return formatted;
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
  const admin = getFirebaseAdmin();

  await admin.firestore().doc(`artists/${artistUid}/arts/${artId}`).delete();

  await admin
    .storage()
    .bucket(BUCKET_NAME)
    .file(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
    .delete();
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
