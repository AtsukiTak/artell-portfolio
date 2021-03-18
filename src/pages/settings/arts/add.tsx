import React, { useState } from "react";
import { useRouter } from "next/router";
import { Art } from "models/art";
import EditArtTemplate from "components/templates/settings/arts/add";
import { createArtRequest } from "libs/apis/art/create";

// for ssr
import { GetServerSideProps } from "next";
import { verifySessionCookie } from "server-libs/sessionCookie";
import { queryPrivateArtById } from "server-libs/art";
import { redirectToSigninPage } from "pages/signin";

const EditArtPage: React.FC = () => {
  const onSubmit = React.useCallback(
    (data) => createArtRequest(data).then(() => undefined),
    []
  );

  return <EditArtTemplate onSubmit={onSubmit} />;
};

export default EditArtPage;
