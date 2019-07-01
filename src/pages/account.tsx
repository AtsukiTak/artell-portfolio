import React, {FC, useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';
import {History} from 'history';

import {Artist, fetchArtist} from 'models/artist';
import Header from 'components/header';
import Sumbnail from 'components/sumbnail';

interface AccountPageProps {
  history: History;
}

const AccountPage: FC<AccountPageProps> = ({history}) => {
  const [user, setUser] = useState<firebase.User | null>(
    firebase.auth().currentUser,
  );

  const onSigninStatusChanged = useCallback(() => {
    const fbuser = firebase.auth().currentUser;
    if (fbuser !== null) {
      setUser(firebase.auth().currentUser);
    }
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(onSigninStatusChanged);
  }, [onSigninStatusChanged]);

  if (user === null) {
    return <UnsignedinAccountPage />;
  } else {
    return <SignedinAccountPage user={user} history={history} />;
  }
};

export default AccountPage;

const UnsignedinAccountPage: FC = () => {
  return (
    <>
      <Header title="Account" />
      <Link to="/signin/">ログインが必要です</Link>
    </>
  );
};

const SignedinAccountPage: FC<{user: firebase.User; history: History}> = ({
  user,
  history,
}) => {
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetchArtist(user.uid).then(artist => {
      if (artist === null) {
        history.push('/account/register/');
      } else {
        setArtist(artist);
      }
    });
  }, [user, history]);

  if (artist === null) {
    return <div>Loading...</div>;
  } else {
    return <ArtistComponent artist={artist} />;
  }
};

const ArtistComponent: FC<{artist: Artist}> = ({artist}) => {
  return (
    <>
      <Header title="Account" />
      <Container>
        <StyledSumbnail src={artist.sumbnailUrl} />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 30px;
`;

const StyledSumbnail = styled(Sumbnail)`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;
