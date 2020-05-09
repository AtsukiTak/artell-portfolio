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
        <Title to="/">ARTELL</Title>
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
    height: 75px;
    font-size: 24px;
    line-height: 75px;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled(Link)`
  display: inline-block;
  font-family: Roboto-Light;
  font-size: 18px;
  letter-spacing: 1.6px;
  color: ${color.LightBlack.hex};
  text-decoration: none;

  @media (min-width: 700px) {
    left: 100px;
    font-size: 24px;
    line-height: 75px;
  }
`;

const SnsLink = styled.a`
  margin-left: 15px;

  & svg {
    width: 20px;
    height: 20px;
  }
`;
