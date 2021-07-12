const path = `${process.cwd()}/.env.local`;
require("dotenv").config({ path });

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

const fetchAllArtistsId = async (): Promise<string[]> => {
  const docs = await Firestore.shared.queryMany("artists");
  return docs.map((doc) => doc.id);
};

(async () => {
  const artistIds = await fetchAllArtistsId();
  artistIds.forEach(async (artistId) => {
    const thumbnailFile = `artists/${artistId}/sumbnail.jpg`;
    if (await Storage.shared.isExists(thumbnailFile)) {
      await Storage.shared.makePublic(thumbnailFile);
    }
    await makePublicArtImagePublic(artistId);
  });
})();
