// for client side
import React from "react";
import { Art } from "models/art";
import { Artist } from "models/artist";
import Header from "components/organisms/Header";
import Footer from "components/organisms/Footer";

// for server side
import { GetServerSideProps } from "next";
import { getFirebaseAdmin } from "server-libs/firebase";
import {
  SessionCookieKey,
  verifySessionCookie,
} from "server-libs/sessionCookie";
import { queryAllArtsOfArtist } from "server-libs/queryArts";
import { queryArtistById } from "server-libs/queryArtists";

type PageProps = {
  artist: Artist;
  arts: Art[];
};

const ProfileSettingPage: React.FC<PageProps> = ({ artist, arts }) => {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  try {
    // cookieからuidを取得
    const sessionCookie = req.cookies[SessionCookieKey];
    if (sessionCookie === undefined) return redirectToSigninPage;

    const userInfo = await verifySessionCookie(sessionCookie).catch(() => null);
    if (!userInfo) return redirectToSigninPage;

    const uid = userInfo.uid;

    const admin = getFirebaseAdmin();

    // firebaseからArt一覧を取得
    const arts = await queryAllArtsOfArtist(uid, admin);

    // firebaseからArtist情報を取得
    const artist = (await queryArtistById(uid, admin))!;

    return {
      props: {
        artist,
        arts,
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const thisPage = "/settings/profile";

const redirectToSigninPage = {
  redirect: {
    destination: `/signin?redirect=${encodeURIComponent(thisPage)}`,
    permanent: false,
  },
};

export default ProfileSettingPage;
