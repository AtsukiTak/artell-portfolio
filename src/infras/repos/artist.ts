import admin from "firebase-admin";
import * as D from "@mojotech/json-type-validation";
import { Artist } from "models/artist";

export const queryArtistById = async (
  uid: string,
  app: admin.app.App
): Promise<Artist | null> => {
  // firestoreからデータを取得する
  const firestore = admin.firestore(app);
  const doc = await firestore.doc(`artists/${uid}`).get();
  const data = doc.data();
  if (data === undefined) {
    return null;
  }
  const decoded = ArtistDocumentDecoder.runWithException(data);

  // storageからデータを取得する
  const file = admin
    .storage(app)
    .bucket("artell-portfolio.appspot.com")
    .file(`artists/${uid}/sumbnail.jpg`);

  const exists = await file.exists().then(([res]) => res);

  // TODO
  // fileのupload時にmakePublicする
  if (exists) {
    await file.makePublic();
  }

  const thumbnailUrl = exists ? file.publicUrl() : null;

  return {
    ...decoded,
    uid,
    thumbnailUrl,
  };
};

// Firestore上のArtist Documentの表現
interface ArtistDocument {
  name: string;
  email: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

const ArtistDocumentDecoder: D.Decoder<ArtistDocument> = D.object({
  name: D.string(),
  email: D.string(),
  comment: D.string(),
  description: D.string(),
  twitter: D.string(),
  facebook: D.string(),
  instagram: D.string(),
});
