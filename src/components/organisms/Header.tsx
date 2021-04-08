import React from "react";
import styled from "styled-components";

import * as color from "libs/colors";

const Header: React.FC = () => {
  return (
    <Container>
      <FlexBox>
        <Title>PORTFOLIO</Title>
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
  justify-content: start;
`;

const Title = styled.a`
  display: inline-block;
  font-family: "Avenir Next Ultra Light";
  font-size: 18px;
  letter-spacing: 2px;
  color: ${color.gray80.hex};
  text-decoration: none;

  @media (min-width: 700px) {
    left: 100px;
    font-size: 20px;
  }
`;
