import * as D from "@mojotech/json-type-validation";
import type { ReqData, ResData } from "pages/api/art/create";
import { request, Method } from "libs/http";

const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});

export const createArtRequest = (
  body: ReqData
): Promise<ResData> =>
  request({
    method: Method.POST,
    url: `/api/art/create`,
    body,
    decoder: ResDataDecoder,
  });
