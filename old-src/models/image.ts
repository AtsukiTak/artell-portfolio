import Jimp from "jimp";

export interface Image {
  getUrl(): Promise<string>;
  clone(): Image;
}

export class DownloadImage {
  constructor(private externalUrl: string, private objectUrl: string | null) {}

  static download(externalUrl: string): DownloadImage {
    return new DownloadImage(externalUrl, null);
  }

  getUrl(): Promise<string> {
    if (this.objectUrl === null) {
      const self = this;
      return fetch(this.externalUrl)
        .then((res) => res.blob())
        .then((blob) => window.URL.createObjectURL(blob))
        .then((url) => {
          self.objectUrl = url;
          return url;
        });
    } else {
      return Promise.resolve(this.objectUrl);
    }
  }

  clone(): Image {
    return new DownloadImage(this.externalUrl, this.objectUrl);
  }
}

export class UploadImage {
  constructor(readonly uri: DataURI) {}

  static MaxWidth = 2048;
  static MaxHeight = 2048;

  static async fromFile(file: File): Promise<UploadImage> {
    const url = window.URL.createObjectURL(file);
    const jimp = await Jimp.read(url);
    const dataURI = await jimp
      .background(0xffffffff)
      .contain(UploadImage.MaxWidth, UploadImage.MaxHeight)
      .getBase64Async(Jimp.MIME_JPEG);
    window.URL.revokeObjectURL(url);
    return new UploadImage(new DataURI(dataURI));
  }

  getUrl(): Promise<string> {
    return Promise.resolve(this.uri.uri);
  }

  getBase64(): string {
    return this.uri.getBase64();
  }

  clone(): Image {
    return new UploadImage(this.uri);
  }
}

class DataURI {
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
