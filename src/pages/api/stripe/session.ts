import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import { getFirebaseApp } from "infras/firebase";
import { queryPublicArtsOfArtist } from "infras/repos/art";
import Stripe from "stripe";

const liveSecretKey = process.env.STRIPE_SK!;
const testSecretKey = process.env.STRIPE_TEST_SK!;

interface ReqData {
  artistUid: string;
  artId: string;
  mode: "live" | "test";
}

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  artistUid: D.string(),
  artId: D.string(),
  mode: D.union(D.constant<"live">("live"), D.constant<"test">("test")),
});

type ResData =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      msg: string;
    };

export default async (req: NextApiRequest, res: NextApiResponse<ResData>) => {
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
  const { artistUid, artId, mode } = decoded;

  // art情報の取得
  const fbApp = getFirebaseApp();
  const arts = await queryPublicArtsOfArtist(artistUid, fbApp);
  const art = arts.find((art) => art.id === artId);
  if (art === undefined) {
    res.status(400).json({ ok: false, msg: "Art not found" });
    return;
  }

  // stripe sessionの作成
  const sk = mode === "live" ? liveSecretKey : testSecretKey;
  const stripe = new Stripe(sk, { apiVersion: "2020-08-27" });
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
