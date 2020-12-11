import React from "react";
import styled from "styled-components";
import Link from "next/link";

import * as color from "./color";
import { ArtellInstagram } from "./svg";

const Header: React.FC = () => {
  return (
    <Container>
      <FlexBox>
        <Link href="/" passHref>
          <Title>PORTFOLIO</Title>
        </Link>
        <SnsLink
          href="https://www.instagram.com/artell_gallery/"
          target="_blank"
        >
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

const Title = styled.a`
  display: inline-block;
  font-family: "Avenir Next Ultra Light";
  font-size: 18px;
  letter-spacing: 2px;
  color: ${color.LightBlack.hex};
  text-decoration: none;

  @media (min-width: 700px) {
    left: 100px;
    font-size: 20px;
  }
`;

const SnsLink = styled.a`
  & svg {
    width: 20px;
    height: 20px;
  }
`;
