import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';

import {onPc} from 'components/responsive';
import Header from 'components/header';
import {Artist, fetchArtist} from 'models/artist';

import EditSumbnailComponent from './settings_profile/components/edit_sumbnail';
import EditAttributesComponent from './settings_profile/components/edit_attributes';

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
  return (
    <>
      <Header title="Settings" displaySigninLink={false} />
      <Container>
        <EditSumbnailComponent artist={artist} fbUser={fbUser} />
        <EditAttributesComponent artist={artist} fbUser={fbUser} />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  margin-top: 50px;

  ${onPc(`
    margin-top: 90px;
  `)}
`;

