// Imageをダウンロードし、ObjectURLを発行する
// ClientSideでしか動かないので注意
export const downloadImage = (url: string): Promise<string> => {
  return fetch(url)
    .then((res) => res.blob())
    .then((blob) => window.URL.createObjectURL(blob));
};
