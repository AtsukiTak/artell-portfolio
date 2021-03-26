import * as D from "@mojotech/json-type-validation";
import { Artist } from "models/artist";
import { Firestore, Storage } from "server-libs/firebase";

/*
 * =================
 * queryArtistById
 * =================
 *
 * idからArtistを検索する
 */
export const queryArtistById = async (uid: string): Promise<Artist | null> => {
  // firestoreからデータを取得する
  const doc = await Firestore.shared.query(`artists/${uid}`);
  if (doc === null) return null;
  const decoded = ArtistDocumentDecoder.runWithException(doc.data());

  // storageからデータを取得する
  const file = `artists/${uid}/sumbnail.jpg`;
  const exists = await Storage.shared.isExists(file);
  const thumbnailUrl = exists ? Storage.shared.getPublicUrl(file) : null;

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
 * createArtist
 * ================
 *
 * Artist情報を作成する
 */
export type CreateArtistArgs = {
  uid: string;
  name: string;
  email: string;
};

export const createArtist = async ({
  uid,
  name,
  email,
}: CreateArtistArgs): Promise<void> => {
  await Firestore.shared.create(`artists/${uid}`, {
    name,
    email,
    comment: "",
    description: "",
    twitter: "",
    facebook: "",
    instagram: "",
  });
};

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
  const promises = [];

  // サムネイルの更新
  if (thumbnailData) {
    promises.push(
      Storage.shared.save(`artists/${uid}/sumbnail.jpg`, thumbnailData, {
        contentType: "image/jpeg",
        accessControl: "publicRead",
      })
    );
  }

  // firestoreの情報の更新
  promises.push(
    Firestore.shared.update(`artists/${uid}`, {
      name,
      comment,
      description,
      twitter,
      facebook,
      instagram,
    })
  );

  await Promise.all(promises);
};
