import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

import { Art } from "models/art";
import { Artist } from "models/artist";
import { pc } from "components/responsive";

import Sumbnail from "components/sumbnail";

const ArtsComponent: FC<{ artist: Artist; arts: Art[] }> = ({
  artist,
  arts
}) => {
  return (
    <Container>
      {/* <Grid container> */}
        {arts.map(art => (
          // <Grid item xs={12} sm={6} md={3}>
            <ArtComponent key={art.attrs.title}>
              <Link to={`/${artist.urlName()}/${art.id}/`}>
                <StyledSumbnail src={art.thumbnail.getUrl()} />
              </Link>
              <Title>{art.attrs.title}</Title>
            </ArtComponent>
          // </Grid>
        ))}
      {/* </Grid> */}
    </Container>
  );
};

export default ArtsComponent;

const Container = styled.div`
  width: 100%;
  margin-bottom: 50px;
`;

const ArtComponent = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  margin-top: 80px;
  ${pc(`
      width: 50%;
      max-width: 820px;
  `)}
`;

const StyledSumbnail = styled(Sumbnail)`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  font-family: NotoSansCJKjp-Bold;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0.44px;
  text-align: center;
  margin-top: 15px;
`;
