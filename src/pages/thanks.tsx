import React from "react";
import Head from "next/head";

import { ThanksPageTemplate } from "templates/thanks";

const ThanksPage: React.FC = () => (
  <>
    <Head>
      <title>thanks</title>
    </Head>
    <ThanksPageTemplate />
  </>
);

export default ThanksPage;
