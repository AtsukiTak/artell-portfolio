import React, {FC} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Header from 'components/header';

const SigninPage: FC<{}> = () => {
  const uiConfig = {
    signInSuccessUrl: '/account/',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      },
    ],
  };

  return (
    <>
      <Header title="ログイン" />
      <Container>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 90%;
  max-width: 980px;
  margin: 0 auto;
  padding-top: 20vh;
`;

export default SigninPage;
