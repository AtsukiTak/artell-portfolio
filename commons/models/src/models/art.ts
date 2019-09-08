import * as firebase from 'firebase/app';

import { Firestore, ArtDocument, Storage } from "../infra/firebase";
import { Image, UploadImage, DownloadImage } from "./image";
import { Artist } from "./artist";

export class Art {
  constructor(
    readonly id: string,
    readonly attrs: ArtAttributes,
    readonly thumbnail: Image
  ) {}
}

export type ArtAttributes = ArtDocument;

export class ArtRepository {
  readonly firestore: Firestore;
  readonly storage: Storage;

  constructor(readonly firebaseApp: firebase.app.App) {
    this.firestore = new Firestore(firebaseApp);
    this.storage = new Storage(firebaseApp);
  }

  /*
   * ===========
   * CREATE
   * ===========
   */
  async create(
    artist: Artist,
    attrs: ArtAttributes,
    thumbnail: UploadImage
  ): Promise<Art> {
    const id = await this.firestore.addArtDoc(artist.uid, attrs);
    await this.storage.upsertArtThumbnail(
      artist.uid,
      id,
      thumbnail.getBase64()
    );
    return new Art(id, attrs, thumbnail);
  }

  /*
   * =============
   * QUERY
   * =============
   */
  async queryListByArtist(artist: Artist): Promise<Art[]> {
    const artList = await this.firestore.queryArtDocList(artist.uid);
    return await Promise.all(
      artList.map(async ({ id, doc }) => {
        const url = await this.storage.queryArtThumbnailUrl(artist.uid, id);
        const thumbnail = await DownloadImage.download(url);
        return new Art(id, doc, thumbnail);
      })
    );
  }

  async queryByTitle(artist: Artist, title: string): Promise<Art | null> {
    const res = await this.firestore.queryArtDocByTitle(artist.uid, title);
    if (res === null) {
      return null;
    }
    const { id, doc } = res;
    const url = await this.storage.queryArtThumbnailUrl(artist.uid, id);
    const thumbnail = await DownloadImage.download(url);
    return new Art(id, doc, thumbnail);
  }

  /*
   * =============
   * UPDATE
   * =============
   */
  async updateAttrs(artist: Artist, art: Art) {
    await this.firestore.updateArtDoc(artist.uid, art.id, art.attrs);
  }

  async updateThumbnail(artist: Artist, art: Art) {
    if (art.thumbnail instanceof UploadImage) {
      await this.storage.upsertArtThumbnail(
        artist.uid,
        art.id,
        art.thumbnail.getBase64()
      );
    }
  }
}
