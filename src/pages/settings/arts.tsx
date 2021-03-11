import React from "react";
import { Art } from "models/art";
import ArtsSettingTemplate from "components/templates/settings/arts";

// for SSR
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryAllArtsOfArtist } from "server-libs/artOps";

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
  res,
}) => {
  try {
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return redirectToSigninPage;

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

const thisPage = "/settings/arts";

const redirectToSigninPage = {
  redirect: {
    destination: `/signin?redirect=${encodeURIComponent(thisPage)}`,
    permanent: false,
  },
};

export default ProfileSettingPage;
