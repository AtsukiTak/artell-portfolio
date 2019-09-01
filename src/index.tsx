import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {rootReducer} from 'services/index';
import {startObserving} from 'services/login';
import App from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyA2uPRzLu-bL9OZk8daGhTcovKEjytmLCQ',
  authDomain: 'artell-portfolio.firebaseapp.com',
  databaseURL: 'https://artell-portfolio.firebaseio.com',
  projectId: 'artell-portfolio',
  storageBucket: 'artell-portfolio.appspot.com',
  messagingSenderId: '1342542049',
  appId: '1:1342542049:web:9860ef00a863452a',
};
firebase.initializeApp(firebaseConfig);

const store = createStore(rootReducer, applyMiddleware(thunk, logger));
store.dispatch<any>(startObserving());

ReactDOM.render(<App store={store} />, document.getElementById('root'));
