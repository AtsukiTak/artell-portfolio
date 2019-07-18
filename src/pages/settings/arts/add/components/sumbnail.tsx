import React, {FC, useState, useCallback} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import Jimp from 'jimp';

import {pc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';
import {SquareBasedWidth} from 'components/square';

interface Props {
  fbUser: firebase.User;
  onSumbnailSelected: (base64: string) => void;
}

const SumbnailComponent: FC<Props> = ({fbUser, onSumbnailSelected}) => {
  const [sumbnailDataURI, setSumbnailDataURI] = useState<string | null>(null);

  const onFileSelected = useCallback(
    e => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const buf = new Buffer(reader.result as ArrayBuffer);
          Jimp.read(buf)
            .then(lenna => lenna.cover(256, 256).getBase64Async(Jimp.MIME_JPEG))
            .then(dataURI => {
              const base64 = extractBase64FromDataURI(dataURI);
              onSumbnailSelected(base64);
              setSumbnailDataURI(dataURI);
            });
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [onSumbnailSelected],
  );

  return (
    <>
      <Container>
        {sumbnailDataURI ? (
          <Sumbnail src={sumbnailDataURI} />
        ) : (
          <StyledSquare />
        )}
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

function extractBase64FromDataURI(dataURI: string): string {
  const re = /base64,(.*)/;
  const found = dataURI.match(re);
  if (found) {
    return found[1];
  } else {
    throw new Error(`Invalid data uri format : ${dataURI}`);
  }
}

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
