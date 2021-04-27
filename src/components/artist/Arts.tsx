import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import Grid from "@material-ui/core/Grid";

import { Art } from "models/art";
import { Artist } from "models/artist";

import { LazyThumbnail } from "components/molecules/LazyThumbnail";
import * as color from "libs/colors";

const ArtsComponent: FC<{ artist: Artist; arts: Art[] }> = ({
  artist,
  arts,
}) => {
  return (
    <Container>
      <Grid container>
        {arts.map((art) => (
          <Grid key={art.id} item xs={12}>
            <ArtComponent>
              <Link href={`/${artist.uid}/${art.id}/`}>
                <a>
                  <StyledLazyThumbnail src={art.thumbnailUrl} />
                </a>
              </Link>
              <Title>{art.title}</Title>
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

const StyledLazyThumbnail = styled(LazyThumbnail)`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${color.gray80.hex};
  letter-spacing: 1.2px;
  text-align: center;
  margin-top: 64px;
`;
