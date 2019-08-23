import React from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'services/index';
import {getArtist} from 'services/artist';
import {pc} from 'components/responsive';
import Header from 'components/header';
import {Artist} from 'models/artist';

import SettingTab from './components/tab';
import ArtsComponent from './arts/components/arts';

interface Props {
  fbUser: firebase.User | null;
}

const ProfileSettingPageWrapper: React.FC<Props> = ({fbUser}) => {
  const artist = useSelector((state: RootState) =>
    fbUser
      ? state.artist.list.find(artist => artist.uid === fbUser.uid)
      : undefined,
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!artist && fbUser) {
      dispatch(getArtist(fbUser.uid));
    }
  }, [fbUser, artist, dispatch]);

  if (fbUser) {
    return (
      <div>
        <h3>
          <Link to="/signin">ログイン</Link>が必要です
        </h3>
      </div>
    );
  } else {
    if (artist) {
      return <ProfileSettingPage artist={artist} />;
    } else {
      return null;
    }
  }
};

export default ProfileSettingPageWrapper;

interface ProfileSettingPageProps {
  artist: Artist;
}

const ProfileSettingPage: React.FC<ProfileSettingPageProps> = ({artist}) => {
  return (
    <>
      <Header title="Settings" />
      <SettingTab selected="tab2" />
      <Container>
        <ArtsComponent arts={artist.arts} />
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
