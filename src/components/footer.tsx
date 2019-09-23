import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <Container>
      artell.life
    </Container>
  );
}

export default Footer;

const Container = styled.footer`
  width: 100vw;
  height: 60px;
  line-height: 60px;
  margin-top: 140px;
  font-family: Roboto-Light;
  font-size: 16px;
  color: #A0A0A0;
  letter-spacing: 0.5px;
  text-align: center;
`;
