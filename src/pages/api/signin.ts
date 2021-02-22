import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import * as D from "@mojotech/json-type-validation";
import "firebase/auth";
import { getFirebase, getFirebaseAdmin } from "server-lib/firebase";

// 本当はClientコードもここに書きたかったんだけど、TreeShaking
// がうまく動いてないっぽくてServerコードがクライアントに含まれて
// しまうようになったのでClientコードと分離する

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
    const cookie = await firebaseAdmin
      .auth()
      // 有効期限は1週間
      .createSessionCookie(token, { expiresIn: 1000 * 60 * 60 * 24 * 7 });

    // cookieのセット
    const cookieOptions = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      // localhostではsecure: trueが効かないため、本番環境でのみ有効化する
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };
    res.setHeader("Set-Cookie", serialize("session", cookie, cookieOptions));
    res.status(200).json({ success: true, msg: "Success" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};

export default SigninHandler;
