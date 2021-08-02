import { useState, useEffect } from "react";

// Imageをダウンロードし、ObjectURLを発行する
// ClientSideでしか動かないので注意
const downloadImage = (url: string): Promise<string> => {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => window.URL.createObjectURL(blob));
};

// Imageをダウンロードし、ObjectURLを発行するhook
export const useObjectURL = (url: string): string | null => {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  useEffect(() => {
    downloadImage(url).then(setDownloaded);
  }, [url]);

  return downloaded;
};

export const blobToDataURI = (blob: Blob): Promise<DataURI> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      // readAsDataURL の結果は、base64 encodedな
      // DataURI になる
      resolve(new DataURI(reader.result as string));
    };

    reader.readAsDataURL(blob);
  });
};

export class DataURI {
  constructor(readonly uri: string) {}

  getBase64(): string {
    const re = /base64,(.*)/;
    const found = this.uri.match(re);
    if (found) {
      return found[1];
    } else {
      throw new Error(`Unexpected data uri format : ${this.uri}`);
    }
  }
}
