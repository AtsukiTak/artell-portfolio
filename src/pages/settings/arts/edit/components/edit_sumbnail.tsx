import React, {FC, useState, useCallback} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import Jimp from 'jimp';

import {onPc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';
import {Art, updateArtSumbnail} from 'models/artist';

interface Props {
  fbUser: firebase.User;
  art: Art;
}

const EditSumbnailComponent: FC<Props> = ({fbUser, art}) => {
  const [sumbnailDataURI, setSumbnailDataURI] = useState<string | null>(null);

  const onSumbnailSelected = useCallback(e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const buf = new Buffer(reader.result as ArrayBuffer);
        Jimp.read(buf)
          .then(lenna => lenna.cover(256, 256).getBase64Async(Jimp.MIME_JPEG))
          .then(dataURI => setSumbnailDataURI(dataURI));
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  return (
    <>
      <Container>
        <Sumbnail src={art.sumbnailUrl} />
        <EditSumbnailRect>Edit</EditSumbnailRect>
        <HiddenFileInput
          type="file"
          accept="image/*"
          onChange={onSumbnailSelected}
        />
      </Container>
      {sumbnailDataURI !== null ? (
        <ModalView>
          <ModalViewInner>
            <ModalViewHeader>このサムネイルに変更しますか？</ModalViewHeader>
            <ModalViewContents>
              <Sumbnail src={sumbnailDataURI} />
              <Buttons>
                <OkButton
                  onClick={() => {
                    const base64 = extractBase64FromDataURI(sumbnailDataURI);
                    return updateArtSumbnail(fbUser, art.id, base64).then(
                      () => {
                        window.location.reload();
                      },
                    );
                  }}>
                  Ok
                </OkButton>
                <CancelButton onClick={() => setSumbnailDataURI(null)}>
                  Cancel
                </CancelButton>
              </Buttons>
            </ModalViewContents>
          </ModalViewInner>
        </ModalView>
      ) : null}
    </>
  );
};

export default EditSumbnailComponent;

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

  ${onPc(`
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

const ModalView = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(27, 31, 35, 0.5);
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
  z-index: 99;
`;

const ModalViewInner = styled.div`
  width: 90vw;
  max-width: 400px;
  height: 80vh;
  margin: 0 auto;
  margin-top: 10vh;
  border-radius: 4px;
  border: 1px solid gray;
  background-color: white;
`;

const ModalViewHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid gray;
  background-color: #f6f8fa;
  padding: 15px 30px;
  color: 24292e;
  font-size: 12px;
`;

const ModalViewContents = styled.div`
  width: 100%;
  padding: 0 30px;
  padding-top: 50px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ButtonBase = styled.div`
  display: inline-block;
  width: 100px;
  height: 50px;
  border-radius: 4px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
`;

const OkButton = styled(ButtonBase)`
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  color: white;
`;

const CancelButton = styled(ButtonBase)`
  background-color: lightgray;
  color: gray;
`;
