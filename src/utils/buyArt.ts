import * as D from "@mojotech/json-type-validation";
import { loadStripe } from "@stripe/stripe-js";
import { ReqData, ResData } from "pages/api/stripe/session";
import { request, Method } from "infras/http";

export const buyArt = async (
  artistUid: string,
  artId: string
): Promise<void> => {
  const pubkey = process.env.NEXT_PUBLIC_STRIPE_PK!;
  const stripe = await loadStripe(pubkey).then((stripe) => {
    // serverで実行された時パニックする(stripeがnullになるので）
    return stripe!;
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
