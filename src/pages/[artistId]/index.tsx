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
import Footer from "components/Footer";
import Profile from "components/artist/Profile";
import Arts from "components/artist/Arts";

// for SSR
import { GetServerSideProps } from "next";
import { getFirebaseAdmin } from "server-libs/firebase";
import { queryArtistById } from "server-libs/queryArtists";
import { queryPublicArtsOfArtist } from "server-libs/queryArts";

interface PageProps {
  artist: Artist;
  arts: Art[];
}

const Page: React.FC<PageProps> = ({ artist, arts }) => {
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

export default Page;

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

/*
 * ======================
 * getServerSideProps
 * ======================
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  // artistの取得
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const artistId = context.params!.artistId as string;
  const fbApp = getFirebaseAdmin();
  const artist = await queryArtistById(artistId, fbApp);

  if (artist === null) {
    return {
      notFound: true,
    };
  }

  // artsの取得
  const arts = await queryPublicArtsOfArtist(artistId, fbApp);

  return {
    props: {
      artist,
      arts,
    },
  };
};

/*
 * ================
 * StyledComponents
 * ================
 */
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
