import React from "react";
import styled from "styled-components";

import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";

import SettingTab from "components/settings/tab";
import ArtsComponent from "components/settings/arts/arts";

const ProfileSettingPage: React.FC<UserProps> = ({ user }) => {
  const { arts } = user;

  return (
    <>
      <Header />
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
