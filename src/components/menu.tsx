import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { pc } from "components/responsive";

import * as color from "./color";
import { ReactComponent as LogoCloseIcon } from "./close.svg";

interface Props {
  onCloseMenuModal: () => void;
}

const Menu: FC<Props> = ({ onCloseMenuModal }) => {
  return (
    <Container>
      <CloseIcon onClick={() => onCloseMenuModal()} />
      <Section>
        <Tag>For Users</Tag>
        <Item to="/">アーティスト会員登録</Item>
        <Item to="/signin">ログイン</Item>
        {/* <Item to="/settings/profile">プロフィール / 作品編集</Item> */}
        {/* <Item to="/signin">ログアウト</Item> */}
      </Section>
      <Section>
        <Tag>About</Tag>
        <Anchor href="https://artell.life/about" target="_blank">
          STATEMENT
        </Anchor>
        <Item to="/">SERVICE</Item>
        <Anchor href="https://artell.life/" target="_blank">
          COMPANY
        </Anchor>
      </Section>
      <Section>
        <Tag>Journal</Tag>
        <Anchor
          href="https://www.instagram.com/artell_gallery/"
          target="_blank"
        >
          Instagram
        </Anchor>
        <Anchor href="https://artell.life/archives" target="_blank">
          Archives
        </Anchor>
      </Section>
      <Section>
        <Tag>Terms</Tag>
        <Anchor href="/terms.pdf" target="_blank">
          利用規約
        </Anchor>
        <Anchor href="/privacy-policy.pdf" target="_blank">
          プライバシーポリシー
        </Anchor>
        <Anchor
          href="/specified-commercial-transaction-act.pdf"
          target="_blank"
        >
          特定商取引法に基づく表記
        </Anchor>
        <Anchor href="https://artell.life/contact" target="_blank">
          ご解約
        </Anchor>
      </Section>
    </Container>
  );
};

export default Menu;

const Container = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: ${color.White.hex};
  padding-top: 12%;
  padding-left: 68px;
  z-index: 100;
  ${pc(`
    display: flex;
    justify-content: flex-start;
    align-items: top;
    padding-left: 10%;
  `)}
`;

const CloseIcon = styled(LogoCloseIcon)`
  position: absolute;
  top: 16px;
  right: 24px;
  ${pc(`
    top: 24px;
    right: 24px;
  `)}
`;

const Section = styled.div`
  margin-bottom: 32px;
  ${pc(`
    margin-bottom: 0px;
    margin-right: 80px;
  `)}
`;

const Tag = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  letter-spacing: 1.2px;
  font-weight: bold;
  color: ${color.LightBlack.hex};
  ${pc(`
    margin-bottom: 24px;
  `)}
`;

const Item = styled(Link)`
  display: block;
  margin-left: 24px;
  margin-bottom: 12px;
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: ${color.LightBlack.hex};
`;

const Anchor = styled.a`
  display: block;
  margin-left: 24px;
  margin-bottom: 12px;
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: ${color.LightBlack.hex};
`;
