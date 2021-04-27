import React from "react";
import Head from "next/head";

import { SendPasswordResetPageTemplate } from "templates/send_password_reset";

const SendPasswordResetPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>password reset</title>
      </Head>
      <SendPasswordResetPageTemplate />
    </>
  );
};

export default SendPasswordResetPage;
