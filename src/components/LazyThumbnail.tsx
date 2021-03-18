import React from "react";
import LazyLoad from "react-lazyload";
import { Thumbnail } from "components/molecules/Thumbnail";

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
