import React from "react";
import { Art } from "models/art";
import EditArtTemplate from "components/templates/settings/arts/edit";
import { updateArtRequest } from "libs/apis/art/update";
import { deleteArtRequest } from "libs/apis/art/delete";

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
  const onUpdate = React.useCallback(
    (data) => updateArtRequest(art.id, data).then(() => undefined),
    [art.id]
  );

  const onDelete = React.useCallback(
    () => deleteArtRequest(art.id).then(() => undefined),
    [art.id]
  );

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
  resolvedUrl,
}) => {
  try {
    // cookieからuidを取得
    const userInfo = await verifySessionCookie(req);
    if (!userInfo) return { redirect: redirectToSigninPage(resolvedUrl) };

    const uid = userInfo.uid;

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
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
