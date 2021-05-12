const path = `${process.cwd()}/.env.local`;
const res = require("dotenv").config({ path });
// なぜか↑を実行しただけだと値がちゃんと設定されていないので
// 手動で設定する
process.env.SERVICE_ACCOUNT_JSON = res.parsed.SERVICE_ACCOUNT_JSON;

import { queryPublicArtsOfArtist } from "server-libs/art";
import { Firestore, Storage } from "server-libs/firebase";

const makePublicArtImagePublic = async (artistId: string): Promise<void> => {
  const arts = await queryPublicArtsOfArtist(artistId);
  await Promise.all(
    arts.map((art) => {
      const file = `artists/${artistId}/arts/${art.id}/sumbnail.jpg`;
      return Storage.shared.makePublic(file);
    })
  );
};

const fetchAllArtistIds = async (): Promise<string[]> => {
  const docs = await Firestore.shared.queryMany("artists");
  return docs.map((doc) => doc.id);
};



(async () => {
  const artistIds = await fetchAllArtistIds();
  artistIds.forEach(async (artistId) => {
    console.log(artistId);
    const thumbnailFile = `artists/${artistId}/sumbnail.jpg`;
    await Storage.shared.makePublic(thumbnailFile);
    await makePublicArtImagePublic(artistId);
  });
})();
