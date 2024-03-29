import type { NextApiRequest, NextApiResponse } from "next";
import * as D from "@mojotech/json-type-validation";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirebase } from "server-libs/firebase";

export type ReqData = {
  email: string;
};

const ReqDataDecoder: D.Decoder<ReqData> = D.object({
  email: D.string(),
});

export type ResData = {
  success: boolean;
  msg: string;
};

const SendPasswordResetMailHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResData>
): Promise<void> => {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  try {
    const decoded = await ReqDataDecoder.runPromise(req.body).catch(() => null);
    if (decoded === null) {
      res.status(400).end();
      return;
    }

    const { email } = decoded;

    await sendPasswordResetEmail(getAuth(getFirebase()), email, {
      url: "https://portfolio.artell.life/signin",
    });

    res.status(200).json({ success: true, msg: "Success" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};

export default SendPasswordResetMailHandler;
