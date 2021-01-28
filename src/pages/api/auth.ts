// for client
import { request as req, Method } from "infras/http";

// for server
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import * as D from "@mojotech/json-type-validation";
import { getFirebaseApp } from "server-lib/firebase";

// クライアントコード
export const request = async (token: string): Promise<string> =>
  req({
    method: Method.POST,
    url: "/api/auth",
    body: {
      token,
    },
    decoder: D.string(),
  });

type ReqData = {
  token: string;
};

// サーバーのAPIコード
export default async (
  req: NextApiRequest,
  res: NextApiResponse<string>
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
      res.status(400).send("Invalid Request Format");
      return;
    }
    const { token } = decoded;

    // session cookieの生成
    const firebase = getFirebaseApp();
    const cookie = await firebase
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
    res.status(200).send("Success");
  } catch {
    res.status(401).send("Unauthorized");
  }
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  token: D.string(),
});
