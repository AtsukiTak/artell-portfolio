import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { blobToDataURI, DataURI } from "libs/image";
import { pc } from "components/Responsive";
import { Thumbnail } from "components/organisms/Thumbnail";
import { FileSelector } from "components/molecules/FileSelector";

type Props = {
  onSelect: (image: DataURI) => void;
  defaultImage: string;
};

export const ImageSelector: React.FC<Props> = React.memo(
  ({ onSelect, defaultImage }) => {
    const [previewImage, setPreviewImage] = useState(defaultImage);

    const onImageSelected = useCallback(
      async (file: File) => {
        const uri = await blobToDataURI(file);
        onSelect(uri);
        setPreviewImage(uri.uri);
      },
      [onSelect]
    );

    return (
      <StyledFileSelector
        onSelect={onImageSelected}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        maxSizeInMB={5}
      >
        <Thumbnail src={previewImage} />
      </StyledFileSelector>
    );
  }
);

const StyledFileSelector = styled(FileSelector)`
  display: block;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  ${pc(`
    margin: 0;
  `)}
`;

ImageSelector.displayName = "ImageSelector";
