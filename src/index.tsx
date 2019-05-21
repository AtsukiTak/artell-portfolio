import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase/app';
import App from './App';

const firebaseConfig = {
  apiKey: "AIzaSyDDpmvxyAd3-1DdUuiQLZQqst7W-i2bGfQ",
  authDomain: "artell-gallery.firebaseapp.com",
  databaseURL: "https://artell-gallery.firebaseio.com",
  projectId: "artell-gallery",
  storageBucket: "artell-gallery.appspot.com",
  messagingSenderId: "339826582586",
  appId: "1:339826582586:web:cee1affa1f8ab0bf"
};
firebase.initializeApp(firebaseConfig);


ReactDOM.render(<App />, document.getElementById('root'));
