import firebase from "firebase/app";

// Clientでfirebaseを使う場合
export const getFirebaseApp = (): firebase.app.App => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase.app();
};

const firebaseConfig = {
  apiKey: "AIzaSyA2uPRzLu-bL9OZk8daGhTcovKEjytmLCQ",
  authDomain: "artell-portfolio.firebaseapp.com",
  databaseURL: "https://artell-portfolio.firebaseio.com",
  projectId: "artell-portfolio",
  storageBucket: "artell-portfolio.appspot.com",
  messagingSenderId: "1342542049",
  appId: "1:1342542049:web:9860ef00a863452a",
};
