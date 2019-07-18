import React, {FC} from 'react';
import styled from 'styled-components';

export function pc(css: string): string {
  return `@media (min-width: 980px) {
    ${css}
  }`;
}

export const MobileContent: FC<{}> = ({children}) => {
  const Container = styled.div`
    @media (min-width: 700px) {
      display: none;
    }
  `;

  return <Container>{children}</Container>;
};

export const PcContent: FC<{}> = ({children}) => {
  const Container = styled.div`
    @media (max-width: 700px) {
      display: none;
    }
  `;

  return <Container>{children}</Container>;
};
