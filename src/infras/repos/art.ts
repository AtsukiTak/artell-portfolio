import admin from "firebase-admin";
import * as D from "@mojotech/json-type-validation";
import { Art } from "models/art";

export const queryPublicArtsOfArtist = async (
  artistUid: string,
  app: admin.app.App
): Promise<Art[]> => {
  // firestoreからデータを取得する
  const collection = await admin
    .firestore(app)
    .collection(`artists/${artistUid}/arts`)
    .where("showPublic", "==", true)
    .get();

  const bucket = admin.storage(app).bucket("artell-portfolio.appspot.com");

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
