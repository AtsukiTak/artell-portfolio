import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import "firebase/auth";
import { getFirebase } from "server-libs/firebase";
import { createArtist } from "server-libs/artist";
import { generateSessionCookieHeaderValue } from "server-libs/sessionCookie";

// 本当はClientコードもここに書きたかったんだけど、TreeShaking
// がうまく動いてないっぽくてServerコードがクライアントに含まれて
// しまうようになったのでClientコードと分離する
// たぶんfirebase関連のimportがsideEffectを持ってるのが原因

export type ReqData = {
  name: string;
  email: string;
  password: string;
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  name: D.string(),
  email: D.string(),
  password: D.string(),
});

export type ResData = {
  success: boolean;
  msg: string;
};

const SignupHandler = async (
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
    const { name, email, password } = decoded;

    const firebase = getFirebase();

    // signup
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user) {
          return cred.user;
        } else {
          throw new Error("auth/unknown-error");
        }
      })
      // firebase SDKの奇妙な振る舞いでerrorがinvalid-email
      // のときにawaitでerrorをthrowしてしまうと
      // アプリがcrashしてしまうのでcatchする必要がある
      .catch((err) => {
        if (
          [
            "auth/email-already-in-use",
            "auth/invalid-email",
            "auth/weak-password",
          ].includes(err.code)
        ) {
          throw new Error(err.code);
        } else {
          throw err;
        }
      });

    // artist登録
    await createArtist({ uid: user.uid, name, email });

    // session cookieの生成
    const token = await user.getIdToken(true);
    const cookieHeaderVal = await generateSessionCookieHeaderValue(token);
    res.setHeader("Set-Cookie", cookieHeaderVal);
    res.status(200).json({ success: true, msg: "Success" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, msg: e.message });
  }
};

export default SignupHandler;
