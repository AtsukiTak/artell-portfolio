import * as firebase from "firebase/app";
import "firebase/firestore";
import * as D from "@mojotech/json-type-validation";

import { request, Method } from "../infra/http";
import { Firestore, Storage, ArtistDocument } from "../infra/firebase";
import { Image, DownloadImage, UploadImage } from "./image";

export class Artist {
  constructor(
    readonly uid: string,
    readonly attrs: ArtistAttributes,
    readonly thumbnail: Image | null
  ) {}
}

export type ArtistAttributes = ArtistDocument;

export class ArtistRepository {
  readonly firestore: Firestore;
  readonly storage: Storage;

  constructor(readonly firebaseApp: firebase.app.App) {
    this.firestore = new Firestore(firebaseApp);
    this.storage = new Storage(firebaseApp);
  }

  /*
   * ===============
   * CREATE
   * ===============
   */
  async create(uid: string, name: string, email: string): Promise<Artist> {
    const doc = {
      name: name,
      email: email,
      comment: "",
      description: "",
      twitter: "",
      facebook: "",
      instagram: "",
    };
    await this.firestore.addArtistDoc(uid, doc);
    return new Artist(uid, doc, null);
  }

  /*
   * ================
   * QUERY
   * ================
   */
  async queryByUid(uid: string): Promise<Artist | null> {
    const res = await this.firestore.queryArtistDoc(uid);
    if (res === null) {
      return null;
    }
    const { doc } = res;
    const url = await this.storage.queryArtistThumbnailUrl(uid);
    const thumbnail = url ? await DownloadImage.download(url) : null;
    return new Artist(uid, doc, thumbnail);
  }

  async queryList(): Promise<Artist[]> {
    const docs = await this.firestore.queryArtistDocList();
    return await Promise.all(
      docs.map(async ({ id, doc }) => {
        const url = await this.storage.queryArtistThumbnailUrl(id);
        const thumbnail = url ? await DownloadImage.download(url) : null;
        return new Artist(id, doc, thumbnail);
      })
    );
  }

  /*
   * =================
   * UPDATE
   * ================
   */
  async updateAttrs(artist: Artist) {
    await this.firestore.updateArtistDoc(artist.uid, artist.attrs);
  }

  async updateThumbnail(artist: Artist) {
    if (artist.thumbnail instanceof UploadImage) {
      await this.storage.upsertArtistThumbnail(
        artist.uid,
        artist.thumbnail.getBase64()
      );
    }
  }
}

/*
 * =================
 * Buy Art
 * =================
 */
declare const Stripe: any;

// - パブリックキーやAPIエンドポイントが誤った値に変更されると危険
// - これらの値は頻繁に更新されない
// - 外部に晒しても問題ない
// 以上の理由から、これらの値はハードコーディングする
const [stripePubKey, createSessionUrl] = (() => {
  const apiBaseUrl =
    "https://us-central1-artell-portfolio.cloudfunctions.net/stripe";
  const env = process.env.NODE_ENV;
  if (env === "development" || env === "test") {
    return ["pk_test_ofrOScu6Vyu1aKzd35untuIj", `${apiBaseUrl}/test/session`];
  } else if (env === "production") {
    return ["pk_live_Iu2DCSkAphvtpDWy2SvMlqUQ", `${apiBaseUrl}/session`];
  } else {
    throw new Error(`Unexpected NODE_ENV : ${env}`);
  }
})();

const stripe = Stripe(stripePubKey);

export function buyArt(artistUid: string, artId: string): Promise<void> {
  return request({
    method: Method.POST,
    url: createSessionUrl,
    body: {
      artistUid,
      artId,
    },
    decoder: BuyArtDecoder,
  })
    .then((sessionId) =>
      stripe.redirectToCheckout({
        sessionId,
      })
    )
    .then((res) => console.log(res));
}

const BuyArtDecoder: D.Decoder<string> = D.object({
  id: D.string(),
}).map(({ id }) => id);
