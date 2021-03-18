import * as D from "@mojotech/json-type-validation";

export enum Method {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface RequestArgs<T> {
  method: Method;
  url: string;
  body?: Record<string, unknown>;
  decoder: D.Decoder<T>;
}

export interface Failure {
  msg: string;
}

export function request<T>(args: RequestArgs<T>): Promise<T> {
  let option = {
    method: args.method,
    headers: new Headers({
      Accept: "application/json",
    }),
  };
  if (args.body) {
    option = Object.assign({ body: JSON.stringify(args.body) }, option);
    option.headers.set("Content-Type", "application/json");
  }
  return fetch(args.url, option).then((res) => {
    if (res.ok) {
      return res.json().then((json) => args.decoder.runPromise(json));
    } else {
      return res
        .text()
        .then((text) =>
          Promise.reject(
            new Error(`Request is failed with ${res.status} : ${text}`)
          )
        );
    }
  });
}
