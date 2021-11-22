import firebase from "firebase/app";

// Clientでfirebaseを使う場合はこの関数経由でfirebase.app.App
// を取得する。
// Appは使用する前に初期化する必要があるため、この関数を経由
// する必要がある。
export const getFirebaseApp = (): firebase.app.App => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase.app();
};

export type FIREBASE_ENV_TYPE = "staging" | "production";

const getFirebaseEnv = () => {
  const firebaseEnv = process.env.NEXT_PUBLIC_FIREBASE_ENV;
  if (!firebaseEnv) {
    throw new Error("error: NEXT_PUBLIC_FIREBASE_ENV is not set!!!");
  }
  if (firebaseEnv !== "staging" && firebaseEnv !== "production") {
    throw new Error(
      `error: invalid NEXT_PUBLIC_FIREBASE_ENV value : ${firebaseEnv}`
    );
  }
  return firebaseEnv;
};

export const firebaseEnv = getFirebaseEnv();

export const firebaseConfig = {
  staging: {
    apiKey: "AIzaSyAvcHY_wB22oE4GB3lIvkR7yme45tj1TF8",
    authDomain: "artell-portfolio-staging.firebaseapp.com",
    projectId: "artell-portfolio-staging",
    storageBucket: "artell-portfolio-staging.appspot.com",
    messagingSenderId: "37561286630",
    appId: "1:37561286630:web:c508d76cc2febc304fa027",
  },
  production: {
    apiKey: "AIzaSyA2uPRzLu-bL9OZk8daGhTcovKEjytmLCQ",
    authDomain: "artell-portfolio.firebaseapp.com",
    projectId: "artell-portfolio",
    storageBucket: "artell-portfolio.appspot.com",
    messagingSenderId: "1342542049",
    appId: "1:1342542049:web:9860ef00a863452a",
  },
}[firebaseEnv];
