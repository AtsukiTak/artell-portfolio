import React, { useCallback } from "react";
import styled from "styled-components";

import { toWebpBlob, blobToDataURI, DataURI } from "libs/image";
import { pc } from "components/Responsive";
import { Thumbnail } from "components/organisms/Thumbnail";

type Props = {
  value: string | DataURI;
  onSelect: (image: DataURI) => void;
};

const ImageSelector: React.FC<Props> = React.memo(
  ({ value, onSelect }: Props) => {
    const onImageSelected = useCallback(
      async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          if (file.size > 1024 * 1024 * 5) {
            alert("ファイルサイズを5MB以下にしてください");
            return;
          }
          const webpBlob = await toWebpBlob(file);
          const uri = await blobToDataURI(webpBlob);
          onSelect(uri);
        }
      },
      [onSelect]
    );

    const src = value instanceof DataURI ? value.uri : value;

    return (
      <Container>
        <Thumbnail src={src} />
        <SelectImageRect>画像を選択する</SelectImageRect>
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={onImageSelected}
        />
      </Container>
    );
  }
);

const Container = styled.label`
  display: block;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  ${pc(`
    margin: 0;
  `)}
`;

const SelectImageRect = styled.div`
  width: 100%;
  margin-top: 4px;
  color: #acacac;
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.46px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

ImageSelector.displayName = "ImageSelector";

export default ImageSelector;
