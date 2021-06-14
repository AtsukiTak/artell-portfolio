import type { NextApiRequest, NextApiResponse } from "next";
import { Firestore, Storage } from "server-libs/firebase";

export type ResData = {
  url: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  if (req.method !== "GET") return res.status(404).end();

  try {
    const doc = await Firestore.shared.firestore().doc("ichibanchi/art").get();
    const { artistId, artId } = doc.data()!;

    const url = Storage.shared
      .bucket()
      .file(`artist/${artistId}/arts/${artId}/sumbnail.jpg`)
      .publicUrl();

    return res.status(200).json({ url });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

export default handler;
