import React from "react";
import Head from "next/head";

// internal modules
import { Artist } from "models/artist";
import { Art } from "models/art";
import { ArtistPageTemplate } from "components/templates/[artistId]";

// for SSR
import { GetServerSideProps } from "next";
import { queryArtistById } from "server-libs/artist";
import { queryPublicArtsOfArtist } from "server-libs/art";

interface Props {
  artist: Artist;
  arts: Art[];
}

const Page: React.FC<Props> = ({ artist, arts }) => (
  <>
    <Head>
      <title>{artist.name}</title>
    </Head>
    <ArtistPageTemplate artist={artist} arts={arts} />
  </>
);

export default Page;

/*
 * ======================
 * getServerSideProps
 * ======================
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  // artistの取得
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const artistId = context.params!.artistId as string;
  const artist = await queryArtistById(artistId);

  if (artist === null) {
    return {
      notFound: true,
    };
  }

  // artsの取得
  const arts = await queryPublicArtsOfArtist(artistId);

  return {
    props: {
      artist,
      arts,
    },
  };
};
