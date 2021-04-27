import React from "react";
import { Redirect } from "next";
import Head from "next/head";

import { SigninPageTemplate } from "templates/signin";

const SigninPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>signin</title>
      </Head>
      <SigninPageTemplate />
    </>
  );
};

/*
 * ==============================
 * redirect to signin page object
 * ==============================
 *
 * which is used under another page's `SSR` context.
 */
export const redirectToSigninPage = (dst: string): Redirect => ({
  destination: `/signin?redirect=${encodeURIComponent(dst)}`,
  permanent: false,
});

export default SigninPage;
