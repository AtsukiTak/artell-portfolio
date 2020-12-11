import React from "react";
import styled from "styled-components";

// material ui
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// internal modules
import { Artist } from "models/artist";
import { downloadImage } from "utils/image";
import Header from "components/Header";
import Footer from "components/Footer";

// for SSR
import { GetServerSideProps } from "next";
import { getFirebaseApp } from "utils/firebase";
import { queryArtistById } from "infras/repos/artist";

interface PageProps {
  artist: Artist;
}

const Page: React.FC<PageProps> = ({ artist }) => {
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);

  React.useEffect(() => {
    downloadImage(artist.thumbnailUrl).then((url) => setThumbnail(url));
  }, [artist.thumbnailUrl]);

  return (
    <>
      <Header />
      {thumbnail ? (
        <ArtistContent artist={artist} thumbnail={thumbnail} />
      ) : (
        <LoadingContent />
      )}
      <Footer />
    </>
  );
};

export default Page;

const LoadingContent: React.FC = () => (
  <ProgressContainer>
    <CircularProgress size={50} thickness={2} />
  </ProgressContainer>
);

const ArtistContent: React.FC<{ artist: Artist; thumbnail: string }> = ({
  artist,
  thumbnail,
}) => (
  <Fade in timeout={2000}>
    <Container>{/* <ProfileComponent artist={artist} /> */}</Container>
  </Fade>
);

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
`;

/*
 * ======================
 * getServerSideProps
 * ======================
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const artistId = context.params!.id as string;
  const fbApp = getFirebaseApp();
  const artist = await queryArtistById(artistId, fbApp);

  if (artist === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      artist,
    },
  };
};
