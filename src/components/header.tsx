import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header = (props: HeaderProps) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <TopLink to="/">Artists</TopLink>
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

const Title = styled.div`
  display: inline-block;
  position: absolute;
  width: 40vw;
  left: 30vw;
  font-family: Roboto-Light;
  font-size: 18px;
  line-height: 53px;
  color: #6f6f6f;
  text-align: center;

  @media (min-width: 700px) {
    font-size: 24px;
    line-height: 75px;
  }
`;

const TopLink = styled(Link)`
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
