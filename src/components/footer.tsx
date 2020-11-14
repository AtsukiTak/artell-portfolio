import React from "react";
import styled from "styled-components";
import * as color from "./color";

const Footer = () => {
  return <Container>For Art People, Always.</Container>;
};

export default Footer;

const Container = styled.footer`
  width: 100vw;
  margin: 32px auto;
  text-align: center;
  font-family: AvenirNext-MediumItalic;
  font-size: 10px;
  letter-spacing: 1.6px;
  text-decoration: none;
  color: ${color.LightGray.hex};
`;
