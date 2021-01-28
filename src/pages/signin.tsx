import React from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Header from "components/Header";
import { request } from "pages/api/auth";

const SigninPage: React.FC = () => {
  const router = useRouter();

  const uiConfig = React.useMemo(() => {
    return {
      ...baseUIConfig,
      callbacks: {
        signInSuccessWithAuthResult: (res: firebase.auth.UserCredential) => {
          if (res.user) {
            res.user
              .getIdToken()
              // IdTokenをサーバーのに通知
              .then((token) => request(token))
              // 成功したらリダイレクト
              .then(() => router.push("/settings"));
          }

          // firebaseによる認証が完了しただけではリダイレクトはしない
          return false;
        },
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
