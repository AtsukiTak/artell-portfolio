import React from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { RootState } from "services/index";
import Header from "components/header";

const SigninPage: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.login.user);

  React.useEffect(() => {
    if (user) {
      router.push("/settings/profile");
    }
  }, [router, user]);

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

const uiConfig = {
  signInSuccessUrl: "/settings/profile",
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
