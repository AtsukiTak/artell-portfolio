import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import * as color from "./color";
import { ReactComponent as LogoMenuIcon } from "./nav-menu.svg";
import Menu from "components/menu";

const Header: FC = () => {
  const [isOpenMenuModal, setIsOpenMenuModal] = React.useState<boolean>(false);
  const closeMenuModal = () => setIsOpenMenuModal(false);

  return (
    <Container>
      <FlexBox>
        <Title to="/">PORTFOLIO</Title>
        <IconMenu onClick={() => setIsOpenMenuModal(!isOpenMenuModal)} />
        {isOpenMenuModal ? <Menu onCloseMenuModal={closeMenuModal} /> : null}
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
  & body {
    overflow: hidden;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    font-size: 20px;
  }
`;

const IconMenu = styled(LogoMenuIcon)`
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  fill: ${color.LightBlack4.hex};
`;
