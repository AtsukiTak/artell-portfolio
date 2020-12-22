import * as D from "@mojotech/json-type-validation";
import { loadStripe } from "@stripe/stripe-js";
import { ReqData, ResData } from "pages/api/stripe/session";
import { request, Method } from "infras/http";

// - これらの値は頻繁に更新されない
// - 外部に晒しても問題ない
// 以上の理由から、これらの値はハードコーディングする
const livePubKey = "pk_live_Iu2DCSkAphvtpDWy2SvMlqUQ";
const testPubKey = "pk_test_ofrOScu6Vyu1aKzd35untuIj";

export const buyArt = async (
  artistUid: string,
  artId: string
): Promise<void> => {
  const mode = process.env.NODE_ENV === "production" ? "live" : "test";

  const pubkey = mode === "live" ? livePubKey : testPubKey;
  const stripe = await loadStripe(pubkey).then((stripe) => {
    // serverで実行された時nullになる
    return stripe!;
  });

  const body: ReqData = {
    artistUid,
    artId,
    mode,
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
