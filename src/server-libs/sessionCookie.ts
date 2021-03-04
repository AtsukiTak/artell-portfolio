import { getFirebaseAdmin } from "./firebase";
import { auth } from "firebase-admin";
import { serialize } from "cookie";

export const SessionCookieKey = "session";

// SessionCookieをセットするための文字列を生成する。
// 呼び出し側は、その文字列を "Set-Cookie" Headerに設定する
// ことでSessionCookieをセットすることができる
export const generateSessionCookieHeaderValue = (
  token: string
): Promise<string> => {
  return (
    getFirebaseAdmin()
      .auth()
      // 有効期限は1週間
      .createSessionCookie(token, { expiresIn: 1000 * 60 * 60 * 24 * 7 })
      .then((cookie) => {
        const options = {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          // localhostではsecure: trueが効かないため、本番環境でのみ有効化する
          secure: process.env.NODE_ENV === "production",
          path: "/",
        };
        return serialize(SessionCookieKey, cookie, options);
      })
  );
};

// SSR時のRequestとAPI時のRequestどちらにも対応するinterface
type GeneralRequest = {
  cookies: {
    [key: string]: string;
  };
};

/// Cookieの値からユーザー情報を抽出する
export const verifySessionCookie = (
  req: GeneralRequest
): Promise<auth.DecodedIdToken | null> => {
  const cookie = req.cookies[SessionCookieKey];
  if (cookie === undefined) return Promise.resolve(null);

  return getFirebaseAdmin()
    .auth()
    .verifySessionCookie(cookie, true)
    .catch(() => null);
};
