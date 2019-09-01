import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {RootState} from 'services/index';
import {pc} from 'components/responsive';
import Header from 'components/header';
import {Art} from 'models/art';
import {Artist} from 'models/artist';

import SettingTab from './components/tab';
import ArtsComponent from './arts/components/arts';

const ProfileSettingPageWrapper: React.FC = () => {
  const user = useSelector((state: RootState) => state.login.user);

  if (!user) {
    return (
      <div>
        <h3>
          <Link to="/signin">ログイン</Link>が必要です
        </h3>
      </div>
    );
  } else {
    return <ProfileSettingPage artist={user.artist} arts={user.arts} />;
  }
};

export default ProfileSettingPageWrapper;

const ProfileSettingPage: React.FC<{artist: Artist; arts: Art[]}> = ({
  artist,
  arts,
}) => {
  return (
    <>
      <Header title="Settings" />
      <SettingTab selected="tab2" />
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
