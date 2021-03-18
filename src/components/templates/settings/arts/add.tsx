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
  onSubmit: (data: SubmitData) => Promise<void>;
};

type SubmitData = {
  thumbnailBase64Data: string;
  title: string;
  widthMM: number;
  heightMM: number;
  description: string;
  materials: string;
  showPublic: boolean;
  salesPriceYen?: number;
  rentalPriceYen?: number;
};

const initialData = {
  title: "",
  widthMM: 0,
  heightMM: 0,
  description: "",
  materials: "",
  showPublic: true,
  salesPriceYen: undefined,
  rentalPriceYen: undefined,
};

const ArtEditPage: React.FC<Props> = ({ onSubmit }) => {
  const [art, setArt] = useState<ArtAttrs>(initialData);
  const [selectedImage, setSelectedImage] = useState<DataURI | null>(null);
  const [requesting, setRequesting] = useState(false);

  const onClickSubmit = React.useCallback(() => {
    if (selectedImage === null) {
      alert("作品の画像を選択してください");
      return;
    }
    setRequesting(true);
    onSubmit({
      thumbnailBase64Data: selectedImage.getBase64(),
      ...art,
    }).then(() => {
      alert("作品が登録されました！");
      setRequesting(false);
    });
  }, [art, selectedImage, onSubmit]);

  return (
    <>
      <Header />
      <Container>
        <Spacer size="20px" />
        <ImageSelector
          value={selectedImage || "/img/add-art-thumbnail.png"}
          onSelect={setSelectedImage}
        />
        <EditAttributes art={art} setArt={setArt} />
        <Button
          bg={requesting ? colors.gray50 : colors.black}
          onClick={onClickSubmit}
          disabled={requesting}
        >
          <Text color={colors.white} size={1}>
            作品を登録
          </Text>
        </Button>
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

export default ArtEditPage;
