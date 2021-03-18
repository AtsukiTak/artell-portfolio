import * as D from "@mojotech/json-type-validation";
import type { ResData } from "pages/api/art/[artId]/delete";
import { request, Method } from "libs/http";

const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});

export const deleteArtRequest = (artId: string): Promise<ResData> =>
  request({
    method: Method.DELETE,
    url: `/api/art/${artId}/delete`,
    decoder: ResDataDecoder,
  });
