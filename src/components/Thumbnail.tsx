import styled from "styled-components";

import { WidthBasedSquare } from "components/Square";

export const Thumbnail = styled(WidthBasedSquare)<{ src: string }>`
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;
