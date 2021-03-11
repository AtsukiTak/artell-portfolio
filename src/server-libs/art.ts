import { app } from "firebase-admin";
import * as D from "@mojotech/json-type-validation";
import { Art } from "models/art";
import { getFirebaseAdmin } from "server-libs/firebase";

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

  const bucket = admin.storage().bucket("artell-portfolio.appspot.com");

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
