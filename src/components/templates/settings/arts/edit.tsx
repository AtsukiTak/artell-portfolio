import React, { useState } from "react";
import styled from "styled-components";

import { Art } from "models/art";
import * as colors from "libs/colors";
import { DataURI } from "libs/image";
import { pc } from "components/Responsive";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { Link } from "components/atoms/Link";
import { Text, Paragraph } from "components/atoms/Text";
import Header from "components/organisms/Header";
import ImageSelector from "components/molecules/ImageSelector";
import EditAttributes, {
  ArtAttrs,
} from "components/organisms/settings/arts/EditAttributes";

type Props = {
  artistUid: string;
  art: Art;
  onUpdate: (data: UpdateData) => Promise<void>;
  onDelete: () => Promise<void>;
};

type UpdateData = {
  thumbnailBase64Data: string | null;
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
};

const ArtEditPage: React.FC<Props> = ({
  artistUid,
  art,
  onUpdate,
  onDelete,
}) => {
  const [updatedArt, setUpdatedArt] = useState<ArtAttrs>(art);
  const [selectedImage, setSelectedImage] = useState<DataURI | null>(null);
  const [requesting, setRequesting] = useState(false);

  const onClickUpdate = React.useCallback(() => {
    setRequesting(true);
    onUpdate({
      thumbnailBase64Data: selectedImage?.getBase64() || null,
      ...updatedArt,
    }).then(() => setRequesting(false));
  }, [updatedArt, selectedImage, onUpdate]);

  const onClickDelete = React.useCallback(() => {
    setRequesting(true);
    onDelete().then(() => setRequesting(false));
  }, [onDelete]);

  return (
    <>
      <Header />
      <Container>
        <Link href={`/${artistUid}/${art.id}`} underline="always">
          <Paragraph align="left">
            <Text color={colors.gray50}>作品ページへ →</Text>
          </Paragraph>
        </Link>
        <Spacer size="20px" />
        <ImageSelector
          value={selectedImage || art.thumbnailUrl}
          onSelect={setSelectedImage}
        />
        <EditAttributes art={updatedArt} setArt={setUpdatedArt} />
        <Buttons>
          <Button
            bg={colors.limegreen}
            onClick={onClickUpdate}
            disabled={requesting}
          >
            <Text color={colors.white} size={1}>
              Update
            </Text>
          </Button>
          <Button
            bg={colors.tomato}
            onClick={onClickDelete}
            disabled={requesting}
          >
            <Text color={colors.white} size={1}>
              Delete
            </Text>
          </Button>
        </Buttons>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  padding: 50px 0;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
`;

export default ArtEditPage;
