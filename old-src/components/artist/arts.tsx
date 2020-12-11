import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";

import { Art } from "models/art";
import { Artist } from "models/artist";

import Thumbnail from "components/sumbnail";
import * as color from "components/color";

const ArtsComponent: FC<{ artist: Artist; arts: Art[] }> = ({
  artist,
  arts,
}) => {
  return (
    <Container>
      <Grid container>
        {arts.map((art) => (
          <Grid item xs={12}>
            <ArtComponent key={art.attrs.title}>
              <Link href={`/${artist.uid}/${art.id}/`}>
                <a>
                  <StyledThumbnail image={art.thumbnail} />
                </a>
              </Link>
              <Title>{art.attrs.title}</Title>
            </ArtComponent>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ArtsComponent;

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
  padding 0 24px;
`;

const ArtComponent = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  margin-top: 120px;
`;

const StyledThumbnail = styled(Thumbnail)`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${color.LightBlack.hex};
  letter-spacing: 1.2px;
  text-align: center;
  margin-top: 64px;
`;
