import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  title: string
}

const Header = (props: HeaderProps) => {
  return (
    <Container>
      {props.title}
    </Container>
  );
}

export default Header;

const Container = styled.header`
  width: 100vw;
  height: 56px;
  font-family: Roboto-Light;
  font-size: 20px;
  line-height: 56px;
  color: black;
  text-align: center;
  background: white;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.5);

  @media (min-width: 700px) {
    height: 75px;
    font-size: 24px;
    line-height: 75px;
  }
`;
