import { request, Method } from "libs/http";
import * as D from "@mojotech/json-type-validation";
import type { ReqData, ResData } from "pages/api/send_password_reset_mail";

export const sendPasswordResetMailRequest = async (
  body: ReqData
): Promise<ResData> =>
  request({
    method: Method.POST,
    url: "/api/send_password_reset_mail",
    body,
    decoder: ResDataDecoder,
  });

const ResDataDecoder: D.Decoder<ResData> = D.object({
  success: D.boolean(),
  msg: D.string(),
});
