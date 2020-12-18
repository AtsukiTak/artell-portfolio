import admin from "firebase-admin";

import serviceAccount from "../../serviceAccountKey.json";

export const getFirebaseApp = (): admin.app.App => {
  if (admin.apps.length === 0) {
    return admin.initializeApp({
      credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
      databaseURL: "https://artell-portfolio.firebaseio.com"
    });
  } else {
    return admin.app();
  }
};
