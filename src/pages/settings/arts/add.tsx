import React from "react";
import { useRouter } from "next/router";

import EditArtTemplate from "components/templates/settings/arts/add";
import { createArtRequest } from "libs/apis/art/create";

const EditArtPage: React.FC = () => {
  const router = useRouter();

  return (
    <EditArtTemplate
      onSubmit={React.useCallback(
        (data) =>
          createArtRequest(data)
            .then(() => {
              alert("新しい作品を追加しました！");
              router.push("/settings/arts");
            })
            .catch(() => {
              alert(
                "作品の登録に失敗しました。お手数ですが運営までお問い合わせください。"
              );
            }),
        [router]
      )}
    />
  );
};

export default EditArtPage;
