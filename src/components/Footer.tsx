import React from "react";
import styled from "styled-components";

import * as color from "./color";
import { pc } from "components/Responsive";

const Footer: React.FC = () => {
  return (
    <Container>
      <HR />
      <FooterList>
        <FooterListItem>
          <Link href="/terms.pdf" target="_blank">
            利用規約
          </Link>
        </FooterListItem>
        <FooterListItem>
          <Link href="/privacy-policy.pdf" target="_blank">
            プライバシーポリシー
          </Link>
        </FooterListItem>
        <FooterListItem>
          <Link
            href="/specified-commercial-transaction-act.pdf"
            target="_blank"
          >
            特定商取引法に基づく表示
          </Link>
        </FooterListItem>
      </FooterList>
      <CopyRight>©ARTELL, Inc.</CopyRight>
    </Container>
  );
};

export default Footer;

const Container = styled.footer`
  width: 100vw;
  height: 60px;
  line-height: 60px;
  margin-top: 140px;
  text-align: center;
`;

const HR = styled.hr`
  width: 10%;
  height: 1px;
  margin-top: 65px;
  margin-bottom: 65px;
  background: #c9c9c9;
  border: 0;

  ${pc(`
    width: 5%;
    margin-top: 130px;
    margin-bottom: 100px;
  `)}
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 12px;
  font-size: 14px;
  letter-spacing: 1.6px;
  &:last-child {
    margin-bottom: 65px;
  }

  ${pc(`
    left: 100px;
    font-size: 16px;
  `)}
`;

const Link = styled.a`
  text-decoration: none;
  color: ${color.LightBlack.hex};
`;

const CopyRight = styled.div`
  font-size: 12px;
  letter-spacing: 1.6px;
  text-decoration: none;
  color: ${color.LightBlack.hex};

  ${pc(`
    left: 100px;
    font-size: 12px;
  `)}
`;
