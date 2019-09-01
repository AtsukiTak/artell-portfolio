import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import Jimp from 'jimp';

import {Image, UploadImage} from 'models/image';
import {Artist, ArtistRepository} from 'models/artist';
import {pc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';

interface Props {
  thumbnail: Image | null;
  setThumbnail: (image: Image) => void;
}

const EditSumbnailComponent: React.FC<Props> = ({thumbnail, setThumbnail}) => {
  const onThumbnailSelected = useCallback(async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const image = await UploadImage.fromFile(file);
      setThumbnail(image);
    }
  }, []);

  return (
    <>
      <Container>
        <Sumbnail
          src={
            thumbnail ? thumbnail.getUrl() : '/img/artist-default-thumbnail.jpg'
          }
        />
        <EditSumbnailRect>Edit</EditSumbnailRect>
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={onThumbnailSelected}
        />
      </Container>
    </>
  );
};

export default EditSumbnailComponent;

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

const EditSumbnailRect = styled.div`
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
