// for client side
import React from "react";
import { Artist } from "models/artist";
import Head from "next/head";

import ProfileSettingPageTemplate from "templates/settings/profile";

// for server side
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryArtistById } from "server-libs/artist";
import { redirectToSigninPage } from "pages/signin";

type PageProps = {
  artist: Artist;
};

const ProfileSettingPage: React.FC<PageProps> = ({ artist }) => (
  <>
    <Head>
      <title>profile settings</title>
    </Head>
    <ProfileSettingPageTemplate artist={artist} />
  </>
);

/*
 * ==============
 * SSR
 * ==============
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  resolvedUrl,
}) => {
  try {
    // cookieからuidを取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return { redirect: redirectToSigninPage(resolvedUrl) };

    const uid = userInfo.uid;

    // firebaseからArtist情報を取得
    const artist = await queryArtistById(uid);
    if (!artist) {
      return { redirect: { destination: "/", permanent: false } };
    }

    return {
      props: {
        artist,
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default ProfileSettingPage;
