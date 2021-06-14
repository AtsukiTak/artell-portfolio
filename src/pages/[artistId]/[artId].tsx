import React from "react";
import Head from "next/head";

// internal modules
import { Artist } from "models/artist";
import { Art } from "models/art";
import { ArtPageTemplate } from "components/templates/[artistId]/[artId]";

// SSR
import { GetServerSideProps } from "next";
import { queryArtistById } from "server-libs/artist";
import { queryPublicArtsOfArtist } from "server-libs/art";

interface Props {
  artist: Artist;
  art: Art;
}

const ArtPage: React.FC<Props> = ({ artist, art }) => (
  <>
    <Head>
      <title>{art.title}</title>
    </Head>
    <ArtPageTemplate artist={artist} art={art} />
  </>
);

export default ArtPage;

/*
 * =================
 * getServerSideProps
 * =================
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const artistId = context.params!.artistId as string;
  const artId = context.params!.artId as string;
  /* eslint-enable */

  // artistの取得
  const artist = await queryArtistById(artistId);
  if (artist === null) {
    return {
      notFound: true,
    };
  }

  // artの取得
  // TODO
  // 対象の作品だけ取得する
  const arts = await queryPublicArtsOfArtist(artistId);
  const art = arts.find((art) => art.id === artId);
  if (art === undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      artist,
      art,
    },
  };
};
