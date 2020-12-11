import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";

import { pc } from "components/responsive";

interface Props {
  selected: "tab1" | "tab2";
}

const Tab: FC<Props> = ({ selected }) => {
  return (
    <Container>
      <TabItem selected={selected === "tab1"} to="/settings/profile">
        プロフィール
      </TabItem>
      <TabItem selected={selected === "tab2"} to="/settings/arts">
        作品
      </TabItem>
    </Container>
  );
};

export default Tab;

const TabItem: FC<{ selected: boolean; to: string }> = ({
  selected,
  to,
  children,
}) => {
  if (selected) {
    return (
      <Link href={to} passHref>
        <SelectedTab>{children}</SelectedTab>
      </Link>
    );
  } else {
    return (
      <Link href={to} passHref>
        <UnselectedTab>{children}</UnselectedTab>
      </Link>
    );
  }
};

const Container = styled.div`
  width: 100%;
  height: 55px;
  background-color: #fafafa;
  border-bottom: 1px solid #e1e4e8;
`;

const TabItemBase = styled.a`
  display: inline-block;
  width: 50%;
  height: 55px;
  font-size: 14px;
  text-align: center;
  line-height: 55px;
  letter-spacing: 1.37px;
  text-decoration: none;
  border-radius: 4px 4px 0px 0px;

  ${pc(`
    font-size: 16px;
  `)}
`;

const SelectedTab = styled(TabItemBase)`
  background-color: white;
  border: 1px solid #e1e4e8;
  border-bottom-color: transparent;
  color: #24292e;
`;

const UnselectedTab = styled(TabItemBase)`
  color: #586069;
`;
