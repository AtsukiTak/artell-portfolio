import React from 'react';
import styled from 'styled-components';

import {withUser, UserProps} from 'components/with-user';
import {pc} from 'components/responsive';
import Header from 'components/header';

import SettingTab from './components/tab';
import ArtsComponent from './arts/components/arts';

const ProfileSettingPage: React.FC<UserProps> = ({user}) => {
  const {arts} = user;

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

export default withUser(ProfileSettingPage);

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  margin-top: 50px;

  ${pc(`
    margin-top: 90px;
  `)}
`;
