import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({title}) => {
  return (
    <Container>
      <Title to="/">ARTELL</Title>
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
  left: 20px;
  font-family: Roboto-Light;
  font-size: 18px;
  line-height: 53px;
  color: #6f6f6f;
  text-decoration: none;

  @media (min-width: 700px) {
    left: 100px;
    font-size: 24px;
    line-height: 75px;
  }
`;
