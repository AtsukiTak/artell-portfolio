import * as D from "@mojotech/json-type-validation";
import type { ReqData, ResData } from "pages/api/signup";
import { request, Method } from "libs/http";

// 内容はReqDataと同じだが、わかりやすさのために再定義している
type Params = {
  name: string;
  email: string;
  password: string;
};

export const signupRequest = (params: Params): Promise<ResData> =>
  request({
    method: Method.POST,
    url: "/api/signup",
    body: toReqData(params),
    decoder: ResDataDecoder,
  });

// 型チェックのため
const toReqData = (params: Params): ReqData => params;

const ResDataDecoder: D.Decoder<ResData> = D.object({
  success: D.boolean(),
  msg: D.string(),
});
