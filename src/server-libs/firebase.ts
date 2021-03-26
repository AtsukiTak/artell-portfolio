import admin, { firestore } from "firebase-admin";
import { Bucket } from "@google-cloud/storage";
import client from "firebase/app";
import { getFirebaseApp } from "../libs/firebase";

const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  throw new Error("SERVICE_ACCOUNT_JSON is not set!!!");
}
const serviceAccount = JSON.parse(serviceAccountJson);

export const getFirebase = (): client.app.App => {
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
    return this.admin.firestore();
  }

  // 上位でawait-try-catchする想定なのでここではtry-catchしていない
  async query(docPath: string): Promise<firestore.DocumentSnapshot | null> {
    const doc = await this.firestore().doc(docPath).get();
    if (doc === undefined) {
      return null;
    }
    return doc;
  }

  async queryMany(
    collectionPath: string
  ): Promise<firestore.DocumentSnapshot[]> {
    const querySnap = await this.firestore().collection(collectionPath).get();
    return querySnap.docs;
  }

  async queryManyWhere(
    collectionPath: string,
    field: string,
    op: "==",
    value: FirestorePrimitive
  ): Promise<firestore.DocumentSnapshot[]> {
    const querySnap = await this.firestore()
      .collection(collectionPath)
      .where(field, op, value)
      .get();
    return querySnap.docs;
  }

  // collectionに新しいdocumentを追加する
  // 作成したいdocumentのidが決まっている場合はcreateメソッドを使う
  async add<T extends FirestoreRawDoc>(
    collectionPath: string,
    data: T
  ): Promise<string> {
    const doc = await this.firestore()
      .collection(collectionPath)
      .add(Firestore.formatAddData(data));
    return doc.id;
  }

  // 新しいdocumentを作成する
  // 作成したいdocumentのidが決まっていない場合はaddメソッドを使う
  async create<T extends FirestoreRawDoc>(
    docPath: string,
    data: T
  ): Promise<void> {
    await this.firestore().doc(docPath).create(Firestore.formatAddData(data));
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
    docPath: string,
    data: T
  ): Promise<void> {
    await this.firestore()
      .doc(docPath)
      .update(Firestore.formatUpdateData(data));
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

  async delete(docPath: string): Promise<void> {
    await this.firestore().doc(docPath).delete();
  }
}

export class Storage {
  // テストなどのためにadmin.app.Appを設定できるようにしている
  // 本番コードでは基本的にsharedを使う
  constructor(readonly admin: admin.app.App, readonly bucketName: string) {}

  static shared: Storage = new Storage(
    getFirebaseAdmin(),
    "artell-portfolio.appspot.com"
  );

  private bucket(): Bucket {
    return this.admin.storage().bucket(this.bucketName);
  }

  async isExists(file: string): Promise<boolean> {
    const res = await this.bucket().file(file).exists();
    return res[0];
  }

  // ファイルのpublicUrlを取得する
  // ファイルがpublicでなかった場合は、URLは無効なものである
  // ただしそのような場合でもこのメソッドはエラーを投げない
  getPublicUrl(file: string): string {
    return this.bucket().file(file).publicUrl();
  }

  // 制限付きのURLを取得する
  // このURLではprivateなものもアクセスできる
  // 有効期限は1時間
  async getSignedUrl(file: string): Promise<string> {
    const res = await this.bucket()
      .file(file)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60, // 1 hour
      });
    return res[0];
  }

  // データをfileに保存する
  // すでにデータが存在する場合は上書きする
  async save(
    file: string,
    data: Buffer,
    options: {
      contentType: "image/jpeg";
      accessControl: "publicRead" | "private";
    }
  ): Promise<void> {
    await this.bucket().file(file).save(data, {
      contentType: options.contentType,
      resumable: false,
      // https://googleapis.dev/nodejs/storage/latest/global.html#CreateWriteStreamOptions
      predefinedAcl: options.accessControl,
    });
  }

  async makePublic(file: string): Promise<void> {
    await this.bucket().file(file).makePublic();
  }

  async makePrivate(file: string): Promise<void> {
    await this.bucket().file(file).makePrivate();
  }

  async delete(file: string): Promise<void> {
    await this.bucket().file(file).delete();
  }
}
