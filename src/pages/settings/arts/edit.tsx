import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';
import {History} from 'history';

import {pc} from 'components/responsive';
import Header from 'components/header';
import {Art, fetchArtist, fetchArtByTitle} from 'models/artist';

import EditSumbnailComponent from './edit/components/edit_sumbnail';
import EditAttributesComponent from './edit/components/edit_attributes';

interface Props {
  fbUser: firebase.User | null;
  history: History;
  artTitle: string;
}

const ProfileSettingPageWrapper: FC<Props> = ({fbUser, history, artTitle}) => {
  const [art, setArt] = useState<Art | null>(null);

  useEffect(() => {
    if (fbUser) {
      fetchArtist(fbUser.uid).then(artist => {
        if (artist === null) {
          throw new Error(`Artist ${fbUser.uid} not found`);
        } else {
          fetchArtByTitle(artist, artTitle)
            .then(setArt)
            .catch(() => history.push('/settings/arts'));
        }
      });
    }
  }, [fbUser, artTitle]);

  if (fbUser === null) {
    return (
      <div>
        <h3>
          <Link to="/signin">ログイン</Link>が必要です
        </h3>
      </div>
    );
  } else {
    if (art !== null) {
      return <ArtEditPage fbUser={fbUser} art={art} />;
    } else {
      return null;
    }
  }
};

export default ProfileSettingPageWrapper;

interface ArtEditPageProps {
  fbUser: firebase.User;
  art: Art;
}

const ArtEditPage: FC<ArtEditPageProps> = ({fbUser, art}) => {
  return (
    <>
      <Header title="Settings" hideSigninLink />
      <Container>
        <EditSumbnailComponent art={art} fbUser={fbUser} />
        <EditAttributesComponent art={art} fbUser={fbUser} />
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
