import * as D from "@mojotech/json-type-validation";
import { loadStripe } from "@stripe/stripe-js";
import { ReqData, ResData } from "pages/api/stripe/session";
import { request, Method } from "libs/http";

const stripePK = process.env.NEXT_PUBLIC_STRIPE_PK;
if (!stripePK) {
  throw new Error("NEXT_PUBLIC_STRIPE_PK is not set!!!");
}

export const buyArt = async (
  artistUid: string,
  artId: string
): Promise<void> => {
  const pubkey = stripePK;
  const stripe = await loadStripe(pubkey).then((stripe) => {
    // serverで実行された時パニックする(stripeがnullになるので）
    if (stripe === null) {
      throw new Error("Never call buyArt function on server side");
    }
    return stripe;
  });

  const body: ReqData = {
    artistUid,
    artId,
  };

  const res = await request({
    method: Method.POST,
    url: "/api/stripe/session",
    body,
    decoder: ResDataDecoder,
  });

  if (res.ok === false) {
    throw new Error(res.msg);
  }

  await stripe.redirectToCheckout({ sessionId: res.id });
};

const ResDataDecoder: D.Decoder<ResData> = D.union(
  D.object({
    ok: D.constant<true>(true),
    id: D.string(),
  }),
  D.object({
    ok: D.constant<false>(false),
    msg: D.string(),
  })
);
