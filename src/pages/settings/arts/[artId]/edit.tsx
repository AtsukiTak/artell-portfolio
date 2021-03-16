import React, { useState } from "react";
import { useRouter } from "next/router";
import { Art } from "models/art";
import EditArtTemplate from "components/templates/settings/arts/edit";

// for ssr
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryPrivateArtById } from "server-libs/art";
import { redirectToSigninPage } from "pages/signin";

type Props = {
  artistUid: string;
  art: Art;
};

const EditArtPage: React.FC<Props> = ({ artistUid, art }) => {
  const router = useRouter();

  const onUpdate = async () => {};

  const onDelete = async () => {};

  return (
    <EditArtTemplate
      artistUid={artistUid}
      art={art}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};

/*
 * ==========
 * SSR
 * ==========
 */
export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
  req,
  res,
  resolvedUrl,
}) => {
  try {
    // cookieからuidを取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return { redirect: redirectToSigninPage(resolvedUrl) };

    const uid = userInfo.uid;

    const artId = params!.artId! as string;
    const art = await queryPrivateArtById(uid, artId);
    if (!art) return { notFound: true };

    return {
      props: {
        art,
        artistUid: uid,
      },
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default EditArtPage;
