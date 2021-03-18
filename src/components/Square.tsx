import React, { FC, useState, useCallback } from "react";
import styled from "styled-components";

export const WidthBasedSquare: FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const [width, setWidth] = useState(0);

  const containerRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <Container ref={containerRef} height={width} className={className}>
      {children}
    </Container>
  );
};

const Container = styled("div")<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;
