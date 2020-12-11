import React from "react";
import firebase from "firebase/app";

// 将来的にはdynamic importしたい
// https://zenn.dev/motch0214/articles/464db74bf24b708fe231
export const useFirebaseApp = (): firebase.app.App => {
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

firebase.initializeApp(firebaseConfig);
