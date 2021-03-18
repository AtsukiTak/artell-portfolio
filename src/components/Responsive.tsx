import React, { FC } from "react";
import styled from "styled-components";

export const MinPcWidth = 980;
export const MaxTabletWidth = 979;
export const MinTabletWidth = 700;
export const MaxMobileWidth = 699;

export function mobile(css: string): string {
  return `@media (max-width: ${MaxMobileWidth}px) {
    ${css}
  }`;
}

export function tablet(css: string): string {
  return `@media (min-width: ${MinTabletWidth}) and (max-width: ${MaxTabletWidth}px) {
    ${css}
  }`;
}

export function pc(css: string): string {
  return `@media (min-width: ${MinPcWidth}px) {
    ${css}
  }`;
}

export const MobileContent: FC = ({ children }) => {
  const Container = styled.div`
    display: none;
    ${mobile(`
      display: block;
    `)}
  `;

  return <Container>{children}</Container>;
};

export const TabletContent: FC = ({ children }) => {
  const Container = styled.div`
    display: none;
    ${tablet(`
      display: block;
    `)}
  `;

  return <Container>{children}</Container>;
};

export const PcContent: FC = ({ children }) => {
  const Container = styled.div`
    display: none;
    ${pc(`
      display: block;
    `)}
  `;

  return <Container>{children}</Container>;
};
