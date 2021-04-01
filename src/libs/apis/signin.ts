import * as D from "@mojotech/json-type-validation";
import type { ReqData, ResData } from "pages/api/signin";
import { request, Method } from "libs/http";

// 内容はReqDataと同じだか、わかりやすさのために再定義している
type Params = {
  email: string;
  password: string;
};

export const signinRequest = (params: Params): Promise<ResData> =>
  request({
    method: Method.POST,
    url: "/api/signin",
    body: toReqData(params),
    decoder: ResDataDecoder,
  });

// 型チェックのため
const toReqData = (params: Params): ReqData => params;

const ResDataDecoder: D.Decoder<ResData> = D.object({
  success: D.boolean(),
  msg: D.string(),
});
