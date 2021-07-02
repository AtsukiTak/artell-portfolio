import React from "react";
import styled from "styled-components";

type Props = {
  src: string;
};

export const Thumbnail: React.FC<Props> = ({ src }) => (
  <SquareContainer>
    <ImageContainer style={{ backgroundImage: `url(${src})` }} />
  </SquareContainer>
);

// `padding-bottom: 100%` はwidthと同じ分buttomにpaddingをとる
const SquareContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export default Thumbnail;
