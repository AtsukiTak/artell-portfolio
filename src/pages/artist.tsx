import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Artist } from "models/artist";
import { RootState } from "services/index";
import { getArtistByName } from "services/artist";
import Header from "../components/header";
import { pc } from "components/responsive";

import ProfileComponent from "./artist/components/profile";
import ArtsComponent from "./artist/components/arts";

interface ArtistPageProps {
  artistUrlName: string;
}

const ArtistPage: React.FC<ArtistPageProps> = ({ artistUrlName }) => {
  const artistName = Artist.decodeArtistUrlName(artistUrlName);

  const artistArts = useSelector((state: RootState) =>
    state.artist.map.get(artistName)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (artistArts === undefined) {
      dispatch(getArtistByName(artistName));
    }
  }, [artistName, artistArts, dispatch]);

  const artist = artistArts ? artistArts.artist : undefined;
  const arts = artistArts ? artistArts.arts : undefined;

  return (
    <>
      <Header title={artistName} />
      {artist && arts ? (
        <Fade in timeout={2000}>
          <Container>
            <ProfileComponent artist={artist} />
            <HR />
            <ArtsComponent artist={artist} arts={arts} />
          </Container>
        </Fade>
      ) : (
        <ProgressContainer>
          <CircularProgress size={50} thickness={2} />
        </ProgressContainer>
      )}
    </>
  );
};

const HR = styled.hr`
  width: 100%;
  margin-top: 65px;
  border: 0.5px solid #979797;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
`;

export default ArtistPage;
