const path = `${process.cwd()}/.env.local`;
const res = require("dotenv").config({ path });
// なぜか↑を実行しただけだと値がちゃんと設定されていないので
// 手動で設定する
process.env.SERVICE_ACCOUNT_JSON = res.parsed.SERVICE_ACCOUNT_JSON;

import { queryPublicArtsOfArtist } from "server-libs/art";
import { Firestore, Storage } from "server-libs/firebase";

const fetchAllArtsId = async (): Promise<string[]> => {
  const querySnapshot = await Firestore.shared.admin
    .firestore()
    .collectionGroup("arts")
    .get();
  return querySnapshot.docs.map((doc) => doc.id);
};

(async () => {
  const artists = await Firestore.shared.queryMany("/artists");
  artists.forEach(async (artist) => {
    const arts = await Firestore.shared.queryMany(`/artists/${artist.id}/arts`);
    arts.forEach(async (art) => {
      const file = `artists/${artist.id}/arts/${art.id}/sumbnail.jpg`;
      await Storage.shared
        .bucket()
        .file(file)
        .download({
          destination: `./arts/${artist.id}-${art.id}.jpg`,
        });
    });
    console.log(`done ${artist.id}`);
  });
})();
