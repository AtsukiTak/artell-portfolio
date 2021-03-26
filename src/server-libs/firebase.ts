import firebase from "firebase/app";
import admin, { firestore } from "firebase-admin";
import { Decoder } from "@mojotech/json-type-validation";

import { getFirebaseApp } from "../libs/firebase";

const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  throw new Error("SERVICE_ACCOUNT_JSON is not set!!!");
}
const serviceAccount = JSON.parse(serviceAccountJson);

export const getFirebase = (): firebase.app.App => {
  return getFirebaseApp();
};

export const getFirebaseAdmin = (): admin.app.App => {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
      databaseURL: "https://artell-portfolio.firebaseio.com",
    });
  } else {
    return admin.app();
  }
};

type FirestorePrimitive = boolean | number | string;
// TODO: undefinedをnullに変えてprimitiveとしたい
type FirestoreRawDoc = Record<string, FirestorePrimitive | undefined>;
type FirestoreAddDoc = Record<string, FirestorePrimitive>;
type FirestoreUpdateDoc = Record<
  string,
  FirestorePrimitive | firestore.FieldValue
>;

export class Firestore {
  // テストなどのためにadmin.app.Appを設定できるようにしている
  // 本番コードでは基本的にsharedを使う
  constructor(readonly admin: admin.app.App) {}

  static shared: Firestore = new Firestore(getFirebaseAdmin());

  private firestore(): admin.firestore.Firestore {
    return admin.firestore();
  }

  // 上位でawait-try-catchする想定なのでここではtry-catchしていない
  async query<T>(path: string): Promise<firestore.DocumentSnapshot | null> {
    const doc = await this.firestore().doc(path).get();
    if (doc === undefined) {
      return null;
    }
    return doc;
  }

  async queryMany<T>(path: string): Promise<firestore.DocumentSnapshot[]> {
    const querySnap = await this.firestore().collection(path).get();
    return querySnap.docs;
  }

  async queryManyWhere<T>(
    path: string,
    field: string,
    op: "==",
    value: FirestorePrimitive
  ): Promise<firestore.DocumentSnapshot[]> {
    const querySnap = await this.firestore()
      .collection(path)
      .where(field, op, value)
      .get();
    return querySnap.docs;
  }

  async create<T extends FirestoreRawDoc>(
    collectionPath: string,
    data: T
  ): Promise<string> {
    const doc = await this.firestore()
      .collection(collectionPath)
      .add(Firestore.formatAddData(data));
    return doc.id;
  }

  private static formatAddData<T extends FirestoreRawDoc>(
    data: T
  ): FirestoreAddDoc {
    const formatted: FirestoreAddDoc = {};

    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        formatted[key] = val;
      }
    });

    return formatted;
  }

  async update<T extends FirestoreRawDoc>(
    path: string,
    data: T
  ): Promise<void> {
    await this.firestore().doc(path).update(Firestore.formatUpdateData(data));
  }

  private static formatUpdateData<T extends FirestoreRawDoc>(
    doc: T
  ): FirestoreUpdateDoc {
    const formatted: FirestoreUpdateDoc = {};

    Object.entries(doc).forEach(([key, val]) => {
      if (val === undefined) {
        formatted[key] = firestore.FieldValue.delete();
      } else {
        formatted[key] = val;
      }
    });

    return formatted;
  }
}
