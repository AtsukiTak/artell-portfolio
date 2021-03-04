import React, { useCallback } from "react";
import styled from "styled-components";

import { readFromFile, DataURI } from "libs/image";
import { pc } from "components/Responsive";
import Thumbnail from "components/Thumbnail";

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
          const image = await readFromFile(file);
          onSelect(image);
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
