import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';

import {pc} from 'components/responsive';
import Header from 'components/header';
import {Artist, Art, fetchArtist, fetchArtsOfArtist} from 'models/artist';

import SettingTab from './components/tab';
import ArtsComponent from './arts/components/arts';

interface Props {
  fbUser: firebase.User | null;
}

const ProfileSettingPageWrapper: FC<Props> = ({fbUser}) => {
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    if (fbUser) {
      fetchArtist(fbUser.uid).then(setArtist);
    }
  }, [fbUser]);

  if (fbUser === null) {
    return (
      <div>
        <h3>
          <Link to="/signin">ログイン</Link>が必要です
        </h3>
      </div>
    );
  } else {
    if (artist !== null) {
      return <ProfileSettingPage fbUser={fbUser} artist={artist} />;
    } else {
      return null;
    }
  }
};

export default ProfileSettingPageWrapper;

interface ProfileSettingPageProps {
  fbUser: firebase.User;
  artist: Artist;
}

const ProfileSettingPage: FC<ProfileSettingPageProps> = ({fbUser, artist}) => {
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    fetchArtsOfArtist(artist.uid).then(setArts);
  }, [artist]);

  return (
    <>
      <Header title="Settings" displaySigninLink={false} />
      <SettingTab selected='tab2' />
      <Container>
        <ArtsComponent arts={arts} />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  margin-top: 50px;

  ${pc(`
    margin-top: 90px;
  `)}
`;
