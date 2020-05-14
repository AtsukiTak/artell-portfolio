import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { Artist } from "models/artist";
import { RootState } from "services/index";
import { getArtistByName } from "services/artist";
import Header from "../components/header";
import Footer from "../components/footer";
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

  if (artistArts === undefined) {
    return <ArtistLoadingPage artistName={artistName} />;
  } else if (artistArts === null) {
    return <ArtistNotFoundPage artistName={artistName} />;
  } else {
    const { artist, arts } = artistArts;
    return (
      <>
        <Header title={artistName} />
        <Fade in timeout={2000}>
          <Container>
            <ProfileComponent artist={artist} />
            <HR />
            <ArtsComponent artist={artist} arts={arts} />
          </Container>
        </Fade>
        <Footer />
      </>
    );
  }
};

const ArtistLoadingPage: React.FC<{ artistName: string }> = ({
  artistName
}) => (
  <>
    <Header title={artistName} />
    <ProgressContainer>
      <CircularProgress size={50} thickness={2} />
    </ProgressContainer>
    <Footer />
  </>
);

const ArtistNotFoundPage: React.FC<{ artistName: string }> = ({
  artistName
}) => (
  <>
    <Header title={artistName} />
    <NotFoundMessage
      variant="body2"
      align="center"
      color="textSecondary"
    >{`作家 「${artistName}」 さんが見つかりませんでした。`}</NotFoundMessage>
    <Footer />
  </>
);

const NotFoundMessage = styled(Typography)`
  margin-top: 40vh;
`;

const HR = styled.hr`
  width: 10%;
  margin-top: 65px;
  border: 0.5px solid #979797;

  ${pc(`
    margin-top: 130px;
  `)}
`;

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
`;

export default ArtistPage;
