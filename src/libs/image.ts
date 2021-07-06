import { useState, useEffect } from "react";
import Jimp from "jimp";

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

// Fileから画像データを読み込み、加工したのち、base64エンコード
// した画像データのURIを返す
export const readFromFile = async (file: File): Promise<DataURI> => {
  const url = window.URL.createObjectURL(file);
  const jimp = await Jimp.read(url);
  const base64Data = await jimp
    .background(0xffffffff)
    .contain(MaxWidth, MaxHeight)
    .quality(90)
    .getBase64Async(Jimp.MIME_JPEG);
  window.URL.revokeObjectURL(url);
  return new DataURI(base64Data);
};

const MaxWidth = 2048;
const MaxHeight = 2048;

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
