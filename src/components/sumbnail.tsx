import React, { FC } from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";

import { SquareBasedWidth } from "./square";
import { Image } from "models/image";

interface SumbnailProps {
  image: Image;
  shade?: boolean;
  className?: string;
}

const Sumbnail: FC<SumbnailProps> = ({ image, shade, className }) => {
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    image.getUrl().then(url => setSrcUrl(url));
  }, [image]);

  if (srcUrl === null) {
    return (
      <ProgressContainer>
        <CircularProgress size={50} thickness={2} />
      </ProgressContainer>
    );
  } else {
    return <Container src={srcUrl} shade={shade} className={className} />;
  }
};

const ProgressContainer = styled.div`
  width: 50px;
  height: 200px;
  margin: 0 auto;
`;

const Container = styled(SquareBasedWidth)<{ src: string; shade?: boolean }>`
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  box-shadow: 0 1px 4px 0
    ${props => (props.shade ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)")};
`;

export default Sumbnail;
