import type { NextApiRequest, NextApiResponse } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { deleteArt } from "server-libs/art";

/*
 * ===========
 * Interfaces
 * ===========
 */
export type ResData = {
  msg: string;
};

/*
 * ===========
 * handler
 * ===========
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  if (req.method !== "DELETE") return res.status(404).end();

  try {
    // 認証情報の取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return res.status(401).end();

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const artId = req.query.artId! as string;

    // 削除の実行
    await deleteArt(userInfo.uid, artId);

    return res.status(200).json({ msg: "Success" });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

export default handler;
