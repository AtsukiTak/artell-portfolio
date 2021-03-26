// for client side
import React from "react";
import { Artist } from "models/artist";
import ProfileSettingPageTemplate from "components/templates/settings/profile";
import type { ReqData, ResData } from "pages/api/artist/me";
import * as D from "@mojotech/json-type-validation";
import { request, Method } from "libs/http";

// for server side
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryArtistById } from "server-libs/artist";
import { redirectToSigninPage } from "pages/signin";

type PageProps = {
  artist: Artist;
};

const ProfileSettingPage: React.FC<PageProps> = ({ artist }) => {
  const updateArtist = React.useCallback((data) => {
    console.log(data);
    return updateArtistInfoRequest(data).then(() => undefined);
  }, []);

  return <ProfileSettingPageTemplate artist={artist} onSave={updateArtist} />;
};

/*
 * ========================
 * updateArtistInfoRequest
 * ========================
 */
const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});

const updateArtistInfoRequest = (data: ReqData): Promise<ResData> =>
  request({
    method: Method.PUT,
    url: "/api/artist/me",
    body: data,
    decoder: ResDataDecoder,
  });

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
