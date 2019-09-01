import {Firestore, ArtDocument, Storage} from 'infra/firebase';
import {Image, UploadImage, DownloadImage} from 'models/image';
import {Artist} from 'models/artist';

export class Art {
  constructor(
    readonly id: string,
    readonly attrs: ArtAttributes,
    readonly thumbnail: Image,
  ) {}
}

export type ArtAttributes = ArtDocument;

export class ArtRepository {
  /*
   * ===========
   * CREATE
   * ===========
   */
  static async create(
    artist: Artist,
    attrs: ArtAttributes,
    thumbnail: UploadImage,
  ): Promise<Art> {
    const id = await Firestore.addArtDoc(artist.uid, attrs);
    await Storage.upsertArtThumbnail(artist.uid, id, thumbnail.getBase64());
    return new Art(id, attrs, thumbnail);
  }

  /*
   * =============
   * QUERY
   * =============
   */
  static async queryListByArtist(artist: Artist): Promise<Art[]> {
    const artList = await Firestore.queryArtDocList(artist.uid);
    return await Promise.all(
      artList.map(async ({id, doc}) => {
        const url = await Storage.queryArtThumbnailUrl(artist.uid, id);
        const thumbnail = await DownloadImage.download(url);
        return new Art(id, doc, thumbnail);
      }),
    );
  }

  static async queryByTitle(
    artist: Artist,
    title: string,
  ): Promise<Art | null> {
    const res = await Firestore.queryArtDocByTitle(artist.uid, title);
    if (res === null) {
      return null;
    }
    const {id, doc} = res;
    const url = await Storage.queryArtThumbnailUrl(artist.uid, id);
    const thumbnail = await DownloadImage.download(url);
    return new Art(id, doc, thumbnail);
  }

  /*
   * =============
   * UPDATE
   * =============
   */
  static async updateAttrs(artist: Artist, art: Art) {
    await Firestore.updateArtDoc(artist.uid, art.id, art.attrs);
  }

  static async updateThumbnail(artist: Artist, art: Art) {
    if (art.thumbnail instanceof UploadImage) {
      await Storage.upsertArtThumbnail(
        artist.uid,
        art.id,
        art.thumbnail.getBase64(),
      );
    }
  }
}
