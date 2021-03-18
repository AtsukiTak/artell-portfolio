import * as D from "@mojotech/json-type-validation";
import type { ReqData, ResData } from "pages/api/art/[artId]/update";
import { request, Method } from "libs/http";

const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});

export const updateArtRequest = (
  artId: string,
  body: ReqData
): Promise<ResData> =>
  request({
    method: Method.PUT,
    url: `/api/art/${artId}/update`,
    body,
    decoder: ResDataDecoder,
  });
