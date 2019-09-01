import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import * as D from '@mojotech/json-type-validation';

export class Firestore {
  /*
   * ==========
   * Artist
   * ==========
   */
  static async upsertArtistDoc(
    artistUid: string,
    doc: ArtistDocument,
  ) {
    await firebase
      .firestore()
      .doc(`artists/${artistUid}`)
      .set(doc);
  }

  static async queryArtistDocList(): Promise<
    {id: string; doc: ArtistDocument}[]
  > {
    const collection = await firebase
      .firestore()
      .collection('artists')
      .get();
    return collection.docs.map(doc => ({
      id: doc.id,
      doc: ArtistDocumentDecoder.runWithException(doc.data()),
    }));
  }

  static async queryArtistDoc(
    id: string,
  ): Promise<{id: string; doc: ArtistDocument} | null> {
    const doc = await firebase
      .firestore()
      .doc(`artists/${id}`)
      .get();
    const data = doc.data();
    if (data === undefined) {
      return null;
    } else {
      return {
        id,
        doc: ArtistDocumentDecoder.runWithException(data),
      };
    }
  }

  static async queryArtistDocByName(
    name: string,
  ): Promise<{id: string; doc: ArtistDocument} | null> {
    const collection = await firebase
      .firestore()
      .collection('artists')
      .where('name', '==', name)
      .limit(1)
      .get();
    if (collection.docs.length === 1) {
      const doc = collection.docs[0];
      return {
        id: doc.id,
        doc: ArtistDocumentDecoder.runWithException(doc.data()),
      };
    } else {
      return null;
    }
  }
  /*
   * ==========
   * Art
   * ==========
   */
  static async addArtDoc(
    artistUid: string,
    data: ArtDocument,
  ): Promise<string> {
    const doc = await firebase
      .firestore()
      .collection(`artists/${artistUid}/arts`)
      .add(data);
    return doc.id;
  }

  static async queryArtDocList(
    artistUid: string,
  ): Promise<{id: string; doc: ArtDocument}[]> {
    const collection = await firebase
      .firestore()
      .collection(`artists/${artistUid}/arts`)
      .get();
    return collection.docs.map(doc => ({
      id: doc.id,
      doc: ArtDocumentDecoder.runWithException(doc.data()),
    }));
  }

  static async queryArtDocByTitle(
    artistUid: string,
    title: string,
  ): Promise<{id: string; doc: ArtDocument} | null> {
    const collection = await firebase
      .firestore()
      .collection(`artists/${artistUid}/arts`)
      .where('title', '==', title)
      .limit(1)
      .get();
    if (collection.docs.length === 1) {
      const doc = collection.docs[0];
      return {
        id: doc.id,
        doc: ArtDocumentDecoder.runWithException(doc.data()),
      };
    } else {
      return null;
    }
  }

  static async updateArtDoc(
    artistUid: string,
    artId: string,
    doc: ArtDocument,
  ) {
    await firebase
      .firestore()
      .doc(`artists/${artistUid}/arts/${artId}`)
      .set(doc);
  }
}

export interface ArtistDocument {
  name: string;
  email: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

const ArtistDocumentDecoder: D.Decoder<ArtistDocument> = D.object({
  name: D.string(),
  email: D.string(),
  comment: D.string(),
  description: D.string(),
  twitter: D.string(),
  facebook: D.string(),
  instagram: D.string(),
});

export interface ArtDocument {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  priceYen: number;
}

const ArtDocumentDecoder: D.Decoder<ArtDocument> = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  priceYen: D.number(),
});

export class Storage {
  /*
   * ==========
   * Artist
   * ==========
   */
  static async upsertArtistThumbnail(
    artistUid: string,
    thumbnailBase64: string,
  ): Promise<void> {
    return firebase
      .storage()
      .ref(`/artists/${artistUid}/sumbnail.jpg`)
      .putString(thumbnailBase64, 'base64', {contentType: 'image/jpeg'})
      .then();
  }

  static async queryArtistThumbnailUrl(id: string): Promise<string> {
    return await firebase
      .storage()
      .ref(`artists/${id}/sumbnail.jpg`)
      .getDownloadURL();
  }

  /*
   * ==========
   * Art
   * ==========
   */
  static async upsertArtThumbnail(
    artistUid: string,
    artId: string,
    thumbnailBase64: string,
  ) {
    return await firebase
      .storage()
      .ref(`/artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
      .putString(thumbnailBase64, 'base64', {contentType: 'image/jpeg'})
      .then();
  }

  static async queryArtThumbnailUrl(
    artistUid: string,
    artId: string,
  ): Promise<string> {
    return await firebase
      .storage()
      .ref(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
      .getDownloadURL();
  }
}
