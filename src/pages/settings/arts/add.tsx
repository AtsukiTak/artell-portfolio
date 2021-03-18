import React from "react";
import EditArtTemplate from "components/templates/settings/arts/add";
import { createArtRequest } from "libs/apis/art/create";

const EditArtPage: React.FC = () => {
  const onSubmit = React.useCallback(
    (data) => createArtRequest(data).then(() => undefined),
    []
  );

  return <EditArtTemplate onSubmit={onSubmit} />;
};

export default EditArtPage;
