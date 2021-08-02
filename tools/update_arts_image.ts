const path = `${process.cwd()}/.env.local`;
require("dotenv").config({ path });

import fs from "fs";
import { queryAllArtsOfArtist } from "server-libs/art";
import { Storage, Firestore } from "server-libs/firebase";

(async () => {
  const artists = await Firestore.shared.queryMany("/artists");
  artists.forEach(async (artist) => {
    const arts = await queryAllArtsOfArtist(artist.id);
    arts.forEach(async (art) => {
      const localFile = `./arts/${artist.id}-${art.id}.jpg`;
      const data = fs.readFileSync(localFile);
      const remoteFile = `artists/${artist.id}/arts/${art.id}/sumbnail.jpg`;

      // 画像の更新
      await Storage.shared.save(remoteFile, data, {
        contentType: "image/jpeg",
        accessControl: "private",
      });

      // 画像の可視性の更新
      if (art.showPublic) {
        await Storage.shared.makePublic(remoteFile);
      }
    });
  });
})();
