import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import * as firebase from 'firebase';

interface HeaderProps {
  title: string;
  hideSigninLink?: boolean;
}

const Header: FC<HeaderProps> = ({title, hideSigninLink}) => {
  const isLoggedIn = firebase.auth().currentUser !== null;
  return (
    <Container>
      <Title to="/">ARTELL</Title>
      {hideSigninLink ? null : isLoggedIn ? (
        <HeaderLink to="/settings/profile">アカウント</HeaderLink>
      ) : (
        <HeaderLink to="/signin">ログイン</HeaderLink>
      )}
    </Container>
  );
};

export default Header;

const Container = styled.header`
  position: relative;
  width: 100vw;
  height: 56px;
  background: white;
  border-bottom: rgba(0, 0, 0, 0.2) solid 1px;

  @media (min-width: 700px) {
    height: 75px;
    font-size: 24px;
    line-height: 75px;
  }
`;

const Title = styled(Link)`
  display: inline-block;
  position: absolute;
  width: 40vw;
  left: 30vw;
  font-family: Roboto-Light;
  font-size: 18px;
  line-height: 53px;
  color: #6f6f6f;
  text-align: center;
  text-decoration: none;

  @media (min-width: 700px) {
    font-size: 24px;
    line-height: 75px;
  }
`;

const HeaderLink = styled(Link)`
  position: absolute;
  height: 100%;
  right: 5vw;
  font-family: Roboto-Light;
  font-size: 16px;
  line-height: 53px;
  color: #6f6f6f;
  text-decoration: none;

  @media (min-width: 700px) {
    font-size: 18px;
    line-height: 75px;
  }
`;
