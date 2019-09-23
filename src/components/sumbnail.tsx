import React, {FC} from 'react';
import styled from 'styled-components';

import {SquareBasedWidth} from './square';

interface SumbnailProps {
  src: string;
  shade?: boolean;
  className?: string;
}

const Sumbnail: FC<SumbnailProps> = ({src, shade, className}) => {
  const Container = styled(SquareBasedWidth)<{src: string; shade?: boolean}>`
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    box-shadow: 0 1px 4px 0
      ${props => (props.shade ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')};
  `;
  return <Container src={src} shade={shade} className={className} />;
};

export default Sumbnail;
