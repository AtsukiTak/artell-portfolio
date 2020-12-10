import React from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { createGlobalStyle } from "styled-components";
import * as firebase from "firebase";
import { StylesProvider } from "@material-ui/core/styles";

import { rootReducer, Store } from "services/index";
import { startObserving } from "services/login";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [store, setStore] = React.useState(initializeStore);

  React.useLayoutEffect(() => {
    firebase.initializeApp(firebaseConfig);
  }, []);

  return (
    <StylesProvider injectFirst>
      <GlobalStyle />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </StylesProvider>
  );
};

const initializeStore = (): Store => {
    const store = createStore(rootReducer, applyMiddleware(thunk, logger));
    store.dispatch<any>(startObserving());
    return store;
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

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
`;

export default MyApp;
