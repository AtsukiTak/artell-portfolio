import type { ReqData, ResData } from "pages/api/artist/me";
import * as D from "@mojotech/json-type-validation";
import { request, Method } from "libs/http";

export const updateArtistInfoRequest = (data: ReqData): Promise<ResData> =>
  request({
    method: Method.PUT,
    url: "/api/artist/me",
    body: data,
    decoder: ResDataDecoder,
  });

const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});
