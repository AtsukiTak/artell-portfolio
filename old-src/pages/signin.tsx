import React from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "services/index";
import Header from "components/header";
import { setSigninCookie } from "utils/signin";

const SigninPage: React.FC = () => {
  const router = useRouter();

  const uiConfig = React.useMemo(() => {
    const callback = () => {
      // signinの結果をサーバーのに通知
      // 成功したらリダイレクト
      setSigninCookie().then(() => router.push("/settings"));

      // firebaseによる認証が完了しただけではリダイレクトはしない
      return false;
    };

    return {
      ...baseUIConfig,
      callbacks: {
        signInSuccessWithAuthResult: callback,
      },
    };
  }, [router]);

  return (
    <>
      <Header />
      <Container>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Container>
    </>
  );
};

export default SigninPage;

const baseUIConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],
};

const Container = styled.div`
  width: 90%;
  max-width: 980px;
  margin: 0 auto;
  padding-top: 20vh;
`;
