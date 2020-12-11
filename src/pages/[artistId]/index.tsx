import { Artist } from "models/artist";

// for SSR
import { GetServerSideProps } from "next";
import { getFirebaseApp } from "utils/firebase";
import { queryArtistById } from "infras/repos/artist";

interface PageProps {
  artist: Artist;
}

const Page: React.FC<PageProps> = ({ artist }) => {
  return <div>{artist.uid}</div>;
};

export default Page;

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
