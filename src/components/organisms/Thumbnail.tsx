import React from "react";
import styled from "styled-components";
import LazyLoad from "react-lazyload";

type ThumbnailProps = {
  src: string;
};

export const Thumbnail: React.FC<ThumbnailProps> = ({ src }) => (
  <Img src={src} />
);

const Img = styled.img`
  display: block;
  width: 100%;
`;

type SquareThumbnailProps = {
  src: string;
};

export const SquareThumbnail: React.FC<SquareThumbnailProps> = ({ src }) => (
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

export interface LazyThumbnailProps {
  src: string;
  height?: number;
  className?: string;
}

export const LazyThumbnail: React.FC<LazyThumbnailProps> = ({
  src,
  height,
  className,
}) => {
  return (
    <div className={className}>
      <LazyLoad height={height} once>
        <Thumbnail src={src} />
      </LazyLoad>
    </div>
  );
};
