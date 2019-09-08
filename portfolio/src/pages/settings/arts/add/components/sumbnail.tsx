import React, {FC, useCallback} from 'react';
import styled from 'styled-components';

import {UploadImage} from 'artell-models';

import {pc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';
import {SquareBasedWidth} from 'components/square';

interface Props {
  thumbnail: UploadImage | null;
  setThumbnail: (thumbnail: UploadImage | null) => void;
}

const SumbnailComponent: FC<Props> = ({thumbnail, setThumbnail}) => {
  const onFileSelected = useCallback(async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const image = await UploadImage.fromFile(file);
      setThumbnail(image);
    }
  }, [setThumbnail]);

  return (
    <>
      <Container>
        {thumbnail ? <Sumbnail src={thumbnail.getUrl()} /> : <StyledSquare />}
        <AddSumbnailRect>Select</AddSumbnailRect>
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={onFileSelected}
        />
      </Container>
    </>
  );
};

export default SumbnailComponent;

const Container = styled.label`
  display: block;
  position: relative;
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  ${pc(`
    display: inline-block;
    width: 400px;
  `)}
`;

const StyledSquare = styled(SquareBasedWidth)`
  background-color: lightgray;
`;

const AddSumbnailRect = styled.div`
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 60px;
  height: 30px;
  background-color: black;
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 13px;
  font-weight: bold;
  line-height: 30px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
