import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { RootState } from "services/index";
import { getArtistById } from "services/artist";
import Header from "components/header";
import Footer from "components/footer";
import { pc } from "components/responsive";

import ProfileComponent from "components/artist/profile";
import ArtsComponent from "components/artist/arts";

interface ArtistPageProps {
  artistId: string;
}

const ArtistPage: React.FC<ArtistPageProps> = ({ artistId }) => {
  const artistArts = useSelector((state: RootState) =>
    state.artist.map.get(artistId)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (artistArts === undefined) {
      dispatch(getArtistById(artistId));
    }
  }, [artistId, artistArts, dispatch]);

  if (artistArts === undefined) {
    return <ArtistLoadingPage />;
  } else if (artistArts === null) {
    return <ArtistNotFoundPage />;
  } else {
    const { artist, arts } = artistArts;
    return (
      <>
        <Header />
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

const ArtistLoadingPage: React.FC = () => (
  <>
    <Header />
    <ProgressContainer>
      <CircularProgress size={50} thickness={2} />
    </ProgressContainer>
    <Footer />
  </>
);

const ArtistNotFoundPage: React.FC = () => (
  <>
    <Header />
    <NotFoundMessage
      variant="body2"
      align="center"
      color="textSecondary"
    >{`作家さんが見つかりませんでした`}</NotFoundMessage>
    <Footer />
  </>
);

const NotFoundMessage = styled(Typography)`
  margin-top: 40vh;
`;

const HR = styled.hr`
  width: 10%;
  height: 1px;
  margin-top: 65px;
  margin-bottom: 65px;
  background: #c9c9c9;
  border: 0;

  ${pc(`
    width: 5%;
    margin-top: 130px;
    margin-bottom: 100px;
  `)}
`;

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
`;

export default ArtistPage;
