import firebase from "firebase/app";
import admin from "firebase-admin";

import { getFirebaseApp } from "../utils/firebase";
import serviceAccount from "../../serviceAccountKey.json";

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
