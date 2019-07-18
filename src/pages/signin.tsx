import React, {FC} from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {History} from 'history';

import Header from 'components/header';
import {fetchArtist, createArtist} from 'models/artist';

const SigninPage: FC<{history: History}> = ({history}) => {
  if (firebase.auth().currentUser) {
    history.push('/settings/profile');
  }

  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (args: {user: firebase.User}) => {
        const fbuser = args.user;
        fetchArtist(fbuser.uid)
          .then(artist => {
            if (artist === null) {
              // 新規登録
              return createArtist(fbuser);
            }
          })
          .then(() => history.push(`/settings/profile`));
        return false;
      },
    },
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      },
    ],
  };

  return (
    <>
      <Header title="ログイン / 新規登録" hideSigninLink />
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
