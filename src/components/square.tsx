import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';

export const SquareBasedWidth: FC<{className?: string}> = ({children, className}) => {
  const [width, setWidth] = useState(0);

  const containerRef = useCallback(node => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const Container = styled("div")<{height: number}>`
    height: ${props => props.height}px;
  `;

  return (
    <Container ref={containerRef} height={width} className={className} >
      { children }
    </Container>
  );
}
