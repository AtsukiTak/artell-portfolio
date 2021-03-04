import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { updateArtist } from "server-libs/queryArtists";

/*
 * ============
 * Interfaces
 * ============
 */
export type ReqData = {
  // base64 encoded thumbnail data
  thumbnailBase64Data: string | null;
  name: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
};

export type ResData = {
  msg: string;
};

/*
 * ==========
 * config
 * ==========
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

/*
 * ==============
 * Server handler
 * ==============
 */
const Handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  if (req.method !== "PUT") return res.status(404).end();

  try {
    // 認証情報の取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return res.status(401).end();

    // request bodyの取得
    const body = await ReqDataDecoder.runPromise(req.body).catch(() => null);
    if (body === null) return res.status(400).end();

    // thumbnailの更新データ
    const thumbnailData = body.thumbnailBase64Data
      ? Buffer.from(body.thumbnailBase64Data, "base64")
      : null;

    // 更新
    const updatedArtist = await updateArtist({
      uid: userInfo.uid,
      thumbnailData,
      name: body.name,
      comment: body.comment,
      description: body.description,
      twitter: body.twitter,
      facebook: body.facebook,
      instagram: body.instagram,
    });

    return res.status(200).json({ msg: "Success" });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  thumbnailBase64Data: D.union(D.string(), D.constant(null)),
  name: D.string(),
  comment: D.string(),
  description: D.string(),
  twitter: D.string(),
  facebook: D.string(),
  instagram: D.string(),
});

export default Handler;
