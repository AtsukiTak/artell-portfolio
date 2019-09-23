import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import * as D from "@mojotech/json-type-validation";

export class Firestore {
  constructor(readonly firebaseApp: firebase.app.App) {}

  firestore(): firebase.firestore.Firestore {
    return firebase.firestore(this.firebaseApp);
  }

  /*
   * ==========
   * Artist
   * ==========
   */
  async upsertArtistDoc(artistUid: string, doc: ArtistDocument) {
    await this.firestore()
      .doc(`artists/${artistUid}`)
      .set(doc);
  }

  async queryArtistDocList(): Promise<{ id: string; doc: ArtistDocument }[]> {
    const collection = await this.firestore()
      .collection("artists")
      .get();
    return collection.docs.map(doc => ({
      id: doc.id,
      doc: ArtistDocumentDecoder.runWithException(doc.data())
    }));
  }

  async queryArtistDoc(
    id: string
  ): Promise<{ id: string; doc: ArtistDocument } | null> {
    const doc = await this.firestore()
      .doc(`artists/${id}`)
      .get();
    const data = doc.data();
    if (data === undefined) {
      return null;
    } else {
      return {
        id,
        doc: ArtistDocumentDecoder.runWithException(data)
      };
    }
  }

  async queryArtistDocByName(
    name: string
  ): Promise<{ id: string; doc: ArtistDocument } | null> {
    const collection = await this.firestore()
      .collection("artists")
      .where("name", "==", name)
      .limit(1)
      .get();
    if (collection.docs.length === 1) {
      const doc = collection.docs[0];
      return {
        id: doc.id,
        doc: ArtistDocumentDecoder.runWithException(doc.data())
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
  async addArtDoc(artistUid: string, data: ArtDocument): Promise<string> {
    const doc = await this.firestore()
      .collection(`artists/${artistUid}/arts`)
      .add(data);
    return doc.id;
  }

  async queryPublicArtDocListByArtist(
    artistUid: string
  ): Promise<{ id: string; doc: ArtDocument }[]> {
    const collection = await this.firestore()
      .collection(`artists/${artistUid}/arts`)
      .where("showPublic", "==", true)
      .get();
    return collection.docs.map(doc => ({
      id: doc.id,
      doc: ArtDocumentDecoder.runWithException(doc.data())
    }));
  }

  async queryAllArtDocListByArtist(
    artistUid: string
  ): Promise<{ id: string; doc: ArtDocument }[]> {
    const collection = await this.firestore()
      .collection(`artists/${artistUid}/arts`)
      .get();
    return collection.docs.map(doc => ({
      id: doc.id,
      doc: ArtDocumentDecoder.runWithException(doc.data())
    }));
  }

  async queryArtDocByTitle(
    artistUid: string,
    title: string
  ): Promise<{ id: string; doc: ArtDocument } | null> {
    const collection = await this.firestore()
      .collection(`artists/${artistUid}/arts`)
      .where("title", "==", title)
      .limit(1)
      .get();
    if (collection.docs.length === 1) {
      const doc = collection.docs[0];
      return {
        id: doc.id,
        doc: ArtDocumentDecoder.runWithException(doc.data())
      };
    } else {
      return null;
    }
  }

  async updateArtDoc(artistUid: string, artId: string, doc: ArtDocument) {
    await this.firestore()
      .doc(`artists/${artistUid}/arts/${artId}`)
      .set(doc);
  }

  async deleteArtDoc(artistUid: string, artId: string) {
    await this.firestore()
      .doc(`artists/${artistUid}/arts/${artId}`)
      .delete();
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
  instagram: D.string()
});

export interface ArtDocument {
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
}

const ArtDocumentDecoder: D.Decoder<ArtDocument> = D.object({
  title: D.string(),
  widthMM: D.number(),
  heightMM: D.number(),
  description: D.string(),
  materials: D.string(),
  showPublic: D.boolean(),
  salesPriceYen: D.optional(D.number()),
  rentalPriceYen: D.optional(D.number())
});

export class Storage {
  constructor(readonly firebaseApp: firebase.app.App) {}

  storage(): firebase.storage.Storage {
    return firebase.storage(this.firebaseApp);
  }
  /*
   * ==========
   * Artist
   * ==========
   */
  async upsertArtistThumbnail(
    artistUid: string,
    thumbnailBase64: string
  ): Promise<void> {
    return this.storage()
      .ref(`/artists/${artistUid}/sumbnail.jpg`)
      .putString(thumbnailBase64, "base64", { contentType: "image/jpeg" })
      .then();
  }

  async queryArtistThumbnailUrl(id: string): Promise<string | null> {
    return await this.storage()
      .ref(`artists/${id}/sumbnail.jpg`)
      .getDownloadURL()
      .catch(() => null);
  }

  /*
   * ==========
   * Art
   * ==========
   */
  async upsertArtThumbnail(
    artistUid: string,
    artId: string,
    thumbnailBase64: string
  ) {
    return await this.storage()
      .ref(`/artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
      .putString(thumbnailBase64, "base64", { contentType: "image/jpeg" })
      .then();
  }

  async queryArtThumbnailUrl(
    artistUid: string,
    artId: string
  ): Promise<string> {
    return await this.storage()
      .ref(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
      .getDownloadURL();
  }

  async deleteArtThumbnail(artistUid: string, artId: string) {
    await this.storage()
      .ref(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
      .delete();
  }
}
