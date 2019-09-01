import React, {FC} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {withRouter} from 'react-router-dom';
import {History} from 'history';
import {useSelector} from 'react-redux';

import {RootState} from 'services/index';
import Header from 'components/header';

const SigninPage: FC<{history: History}> = ({history}) => {
  const user = useSelector((state: RootState) => state.login.user);

  if (user) {
    history.push('/settings/profile');
  }

  const uiConfig = {
    signInSuccessUrl: '/settings/profile',
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      },
    ],
  };

  return (
    <>
      <Header title="ログイン / 新規登録" />
      <Container>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Container>
    </>
  );
};

export default withRouter(SigninPage);

const Container = styled.div`
  width: 90%;
  max-width: 980px;
  margin: 0 auto;
  padding-top: 20vh;
`;
