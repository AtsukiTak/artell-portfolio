import Jimp from 'jimp';

export interface Image {
  getUrl(): string;
  clone(): Image;
}

export class DownloadImage extends Image {
  constructor(private url: string) {
    super();
  }

  static async download(externalUrl: string): Promise<DownloadImage> {
    const res = await fetch(externalUrl);
    const blob = await res.blob();
    return new DownloadImage(window.URL.createObjectURL(blob));
  }

  getUrl(): string {
    return this.url;
  }

  clone(): Image {
    return new DownloadImage(this.url);
  }
}

export class UploadImage extends Image {
  constructor(readonly uri: DataURI) {
    super();
  }

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

  getUrl(): string {
    return this.uri.uri;
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
