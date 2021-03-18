import React from "react";
import { Art } from "models/art";
import ArtsSettingTemplate from "components/templates/settings/arts";

// for SSR
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryAllArtsOfArtist } from "server-libs/art";
import { redirectToSigninPage } from "pages/signin";

type Props = {
  arts: Art[];
};

const ProfileSettingPage: React.FC<Props> = ({ arts }) => {
  return <ArtsSettingTemplate arts={arts} />;
};

/*
 * ========
 * SSR
 * ========
 */
export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  resolvedUrl,
}) => {
  try {
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return { redirect: redirectToSigninPage(resolvedUrl) };

    const uid = userInfo.uid;

    const arts = await queryAllArtsOfArtist(uid);

    return {
      props: {
        arts,
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default ProfileSettingPage;
