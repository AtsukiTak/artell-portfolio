import type { ReactElement } from "react";
import type { AppProps } from "next/app";
import "global.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return <Component {...pageProps} />;
};

export default MyApp;
