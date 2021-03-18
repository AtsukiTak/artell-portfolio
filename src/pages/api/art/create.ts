import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { createArt } from "server-libs/art";

/*
 * ===========
 * Interfaces
 * ===========
 */
export type ReqData = {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
  // base64 encoded thumbnail data
  thumbnailBase64Data: string;
};

export type ResData = {
  msg: string;
};

/*
 * =========
 * config
 * =========
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
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
  if (req.method !== "POST") return res.status(404).end();

  try {
    // 認証情報の取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return res.status(401).end();

    // request bodyの取得
    const body = await ReqDataDecoder.runPromise(req.body).catch(() => null);
    if (body === null) return res.status(400).end();

    // thumbnailの更新データ
    const thumbnailData = Buffer.from(body.thumbnailBase64Data, "base64");

    // 更新
    await createArt({
      artistUid: userInfo.uid,
      ...body,
      thumbnailData,
    });

    return res.status(200).json({ msg: "Success" });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  showPublic: D.boolean(),
  salesPriceYen: D.optional(D.number()),
  rentalPriceYen: D.optional(D.number()),
  thumbnailBase64Data: D.string(),
});

export default handler;
