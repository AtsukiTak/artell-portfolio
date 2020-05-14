import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import * as color from "./color";
import { ArtellInstagram } from "./logo";

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({title}) => {
  return (
    <Container>
      <FlexBox>
        <Title to="/">#40326d</Title>
        <SnsLink href="https://www.instagram.com/artell_gallery/" target="_blank">
          <ArtellInstagram />
        </SnsLink>
      </FlexBox>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  position: relative;
  width: 100vw;
  padding: 20px;
  @media (min-width: 700px) {
    font-size: 24px;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(Link)`
  display: inline-block;
  font-family: "Avenir Next Ultra Light";
  font-size: 18px;
  letter-spacing: 2px;
  color: ${color.LightBlack.hex};
  text-decoration: none;

  @media (min-width: 700px) {
    left: 100px;
    font-size: 24px;
  }
`;

const SnsLink = styled.a`
  & svg {
    width: 20px;
    height: 20px;
  }
`;
