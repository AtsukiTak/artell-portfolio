import React, { useCallback } from "react";
import styled from "styled-components";

type Props = {
  onSelect: (file: File) => void;
  accept: string;
  maxSizeInMB: number;
  className?: string;
};

export const FileSelector: React.FC<Props> = React.memo(
  ({ onSelect, accept, maxSizeInMB, className, children }) => {
    const onImageSelected = useCallback(
      async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          if (file.size > maxSizeInMB * 1024 * 1024) {
            alert(`ファイルサイズを${maxSizeInMB}MB以下にしてください`);
            return;
          }
          onSelect(file);
        }
      },
      [onSelect, maxSizeInMB]
    );

    return (
      <label className={className}>
        {children}
        <HiddenFileInput
          type="file"
          accept={accept}
          onChange={onImageSelected}
        />
      </label>
    );
  }
);

const HiddenFileInput = styled.input`
  display: none;
`;

FileSelector.displayName = "FileSelector";
