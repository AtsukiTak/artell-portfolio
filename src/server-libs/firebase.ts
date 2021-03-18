import firebase from "firebase/app";
import admin from "firebase-admin";

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
