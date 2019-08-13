import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import App from './App';

const firebaseApiKey = process.env.REACT_APP_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: 'artell-portfolio.firebaseapp.com',
  databaseURL: 'https://artell-portfolio.firebaseio.com',
  projectId: 'artell-portfolio',
  storageBucket: 'artell-portfolio.appspot.com',
  messagingSenderId: '1342542049',
  appId: '1:1342542049:web:9860ef00a863452a',
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));
