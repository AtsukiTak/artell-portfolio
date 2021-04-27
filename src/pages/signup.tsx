import React from "react";
import Head from "next/head";

import { SignupPageTemplate } from "templates/signup";

const SigninPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>signup</title>
      </Head>
      <SignupPageTemplate />
    </>
  );
};

export default SigninPage;
