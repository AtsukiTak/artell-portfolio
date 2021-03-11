import { app } from "firebase-admin";
import * as D from "@mojotech/json-type-validation";
import { Artist } from "models/artist";
import { getFirebaseAdmin } from "server-libs/firebase";

const BUCKET_NAME = "artell-portfolio.appspot.com";

/*
 * =================
 * queryArtistById
 * =================
 *
 * idからArtistを検索する
 */
export const queryArtistById = async (
  uid: string,
  admin: app.App
): Promise<Artist | null> => {
  // firestoreからデータを取得する
  const firestore = admin.firestore();
  const doc = await firestore.doc(`artists/${uid}`).get();
  const data = doc.data();
  if (data === undefined) {
    return null;
  }
  const decoded = ArtistDocumentDecoder.runWithException(data);

  // storageからデータを取得する
  const file = admin
    .storage()
    .bucket(BUCKET_NAME)
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

/*
 * ================
 * updateArtist
 * ================
 *
 * Artist情報を更新する
 */
export type UpdateArtistArgs = {
  uid: string;
  thumbnailData: Buffer | null;
  name: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
};

// 対象のartistが存在するかどうかのチェックは行わない.
// それはビジネスロジックで担保されるべき.
export const updateArtist = async ({
  uid,
  thumbnailData,
  name,
  comment,
  description,
  twitter,
  facebook,
  instagram,
}: UpdateArtistArgs): Promise<void> => {
  const admin = getFirebaseAdmin();

  let promises = [];

  // サムネイルの更新
  if (thumbnailData) {
    promises.push(
      admin
        .storage()
        .bucket(BUCKET_NAME)
        .file(`artists/${uid}/sumbnail.jpg`)
        .save(thumbnailData, {
          contentType: "image/jpeg",
          public: true,
          resumable: false,
        })
    );
  }

  // firestoreの情報の更新
  promises.push(
    admin
      .firestore()
      .doc(`artists/${uid}`)
      .update({
        name,
        comment,
        description,
        twitter,
        facebook,
        instagram,
      })
      .then(() => undefined)
  );

  await Promise.all(promises);
};
