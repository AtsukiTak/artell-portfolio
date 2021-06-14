import React from "react";
import styled from "styled-components";

// material ui
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// internal modules
import { Artist } from "models/artist";
import { Art } from "models/art";
import { useObjectURL } from "libs/image";
import { pc } from "components/Responsive";
import Header from "components/organisms/Header";
import Footer from "components/organisms/Footer";
import Profile from "components/artist/Profile";
import Arts from "components/artist/Arts";

interface Props {
  artist: Artist;
  arts: Art[];
}

export const ArtistPageTemplate: React.FC<Props> = ({ artist, arts }) => {
  const url = artist.thumbnailUrl || "/img/artist-default-thumbnail.jpg";
  const downloadedThumbnail = useObjectURL(url);

  return (
    <>
      <Header />
      {downloadedThumbnail ? (
        <ArtistContent
          artist={artist}
          arts={arts}
          downloadedThumbnail={downloadedThumbnail}
        />
      ) : (
        <LoadingContent />
      )}
      <Footer />
    </>
  );
};

const LoadingContent: React.FC = () => (
  <ProgressContainer>
    <CircularProgress size={50} thickness={2} />
  </ProgressContainer>
);

const ArtistContent: React.FC<{
  artist: Artist;
  arts: Art[];
  downloadedThumbnail: string;
}> = ({ artist, arts, downloadedThumbnail }) => (
  <Fade in timeout={2000}>
    <Container>
      <Profile artist={artist} downloadedThumbnail={downloadedThumbnail} />
      <HR />
      <Arts artist={artist} arts={arts} />
    </Container>
  </Fade>
);

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
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
