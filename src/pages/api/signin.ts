import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import "firebase/auth";
import { getFirebase, getFirebaseAdmin } from "server-libs/firebase";
import { generateSessionCookieHeaderValue } from "server-libs/sessionCookie";

// 本当はClientコードもここに書きたかったんだけど、TreeShaking
// がうまく動いてないっぽくてServerコードがクライアントに含まれて
// しまうようになったのでClientコードと分離する
// たぶんfirebase関連のimportがsideEffectを持ってるのが原因

export type ReqData = {
  email: string;
  password: string;
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  email: D.string(),
  password: D.string(),
});

export type ResData = {
  success: boolean;
  msg: string;
};

const SigninHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  // POSTのみ受付
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  try {
    // requestのdecode
    const decoded = await ReqDataDecoder.runPromise(req.body).catch(() => null);
    if (decoded === null) {
      res.status(400).json({
        success: false,
        msg: "Invalid Request Format",
      });
      return;
    }
    const { email, password } = decoded;

    const firebase = getFirebase();
    const firebaseAdmin = getFirebaseAdmin();

    // signin
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      // firebase SDKの奇妙な振る舞いでerrorがinvalid-email
      // のときにアプリがcrashしてしまうのでcatchする必要がある
      .then((cred) => cred.user)
      .catch((e) => null);

    if (user === null) throw new Error("failed to signInWithEmailAndPassword");

    const token = await user.getIdToken(true);

    // session cookieの生成
    const cookieHeaderVal = await generateSessionCookieHeaderValue(token);
    res.setHeader("Set-Cookie", cookieHeaderVal);
    res.status(200).json({ success: true, msg: "Success" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};

export default SigninHandler;
