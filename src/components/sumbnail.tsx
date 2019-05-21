import React, { FC } from 'react';
import styled from 'styled-components';

import { SquareBasedWidth } from './square';

const Sumbnail: FC<{src: string, className?: string}> = ({src, className}) => {
  const Container = styled(SquareBasedWidth)<{src: string}>`
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.5);
  `;
  return (
    <Container src={src} className={className} />
  );
}

export default Sumbnail;
