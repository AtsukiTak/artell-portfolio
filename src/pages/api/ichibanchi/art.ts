import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { Firestore } from "server-libs/firebase";
import { queryArtById } from "server-libs/art";
import { queryArtistById } from "server-libs/artist";

export type ResData = {
  artTitle: string;
  artistName: string;
  artMaterials: string;
  artSize: readonly [number, number] | null;
  imageUrl: string;
  portfolioLink: string;
};

const cors = Cors({
  origin: "*",
  methods: ["GET"],
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  cors(req, res, (err) => {
    if (err) {
      throw new err();
    }
  });

  if (req.method !== "GET") return res.status(404).end();

  try {
    const doc = await Firestore.shared.firestore().doc("ichibanchi/art").get();
    const { artistId, artId } = doc.data()!;

    const artist = (await queryArtistById(artistId))!;

    const art = (await queryArtById(artistId, artId))!;

    const artSize =
      art.widthMM === 0 || art.heightMM === 0
        ? null
        : ([art.widthMM, art.heightMM] as const);

    const portfolioLink = `https://portfolio.artell.life/${artistId}/${artId}`;

    // CDNで1時間キャッシュを使用する。
    // SwRを設定しているので、キャッシュが無効になった次のリクエストでも
    // 引き続きキャッシュを利用する。ただし、裏でキャッシュの更新を行う。
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"]);

    return res.status(200).json({
      artTitle: art.title,
      artistName: artist.name,
      artMaterials: art.materials,
      artSize,
      imageUrl: art.thumbnailUrl,
      portfolioLink,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

export default handler;
