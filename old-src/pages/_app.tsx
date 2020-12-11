import React from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { createGlobalStyle } from "styled-components";
import { StylesProvider } from "@material-ui/core/styles";
import firebase from "firebase/app";

import { rootReducer, Store } from "services/index";
import { startObserving } from "services/login";
import { useFirebaseApp } from "hooks/useFirebase";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const firebaseApp = useFirebaseApp();
  const [store, setStore] = React.useState(() => initializeStore(firebaseApp));

  return (
    <StylesProvider injectFirst>
      <GlobalStyle />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </StylesProvider>
  );
};

const initializeStore = (firebaseApp: firebase.app.App): Store => {
  const store = createStore(rootReducer, applyMiddleware(thunk, logger));
  store.dispatch<any>(startObserving(firebaseApp));
  return store;
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
