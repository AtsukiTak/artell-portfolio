import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import { getFirebaseAdmin } from "server-libs/firebase";
import { queryPublicArtsOfArtist } from "server-libs/queryArts";
import Stripe from "stripe";

const stripeSK = process.env.STRIPE_SK;
if (!stripeSK) {
  throw new Error("STRIPE_SK is not set!!!!");
}

export type ReqData = {
  artistUid: string;
  artId: string;
};

export type ResData =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      msg: string;
    };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  // POSTのみ受付
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  // requestのdecode
  const decoded = await ReqDataDecoder.runPromise(req.body).catch(() => null);
  if (decoded === null) {
    res.status(400).json({ ok: false, msg: "Invalid Request Format" });
    return;
  }
  const { artistUid, artId } = decoded;

  // art情報の取得
  const fbApp = getFirebaseAdmin();
  const arts = await queryPublicArtsOfArtist(artistUid, fbApp);
  const art = arts.find((art) => art.id === artId);
  if (art === undefined) {
    res.status(400).json({ ok: false, msg: "Art not found" });
    return;
  }

  // stripe sessionの作成
  const stripe = new Stripe(stripeSK, { apiVersion: "2020-08-27" });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "required",
    success_url: "https://portfolio.artell.life/_thanks",
    cancel_url: `https://portfolio.artell.life/${artistUid}/${artId}`,
    line_items: [
      {
        name: art.title,
        images: [art.thumbnailUrl],
        amount: art.salesPriceYen,
        currency: "jpy",
        quantity: 1,
      },
    ],
  });

  // response
  res.json({ ok: true, id: session.id });
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  artistUid: D.string(),
  artId: D.string(),
});
