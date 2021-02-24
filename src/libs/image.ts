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
