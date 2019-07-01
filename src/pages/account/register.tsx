import React, {FC, useState, useCallback} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import Jimp from 'jimp';
import {History} from 'history';

import Header from 'components/header';
import Sumbnail from 'components/sumbnail';

interface RegisterPageProps {
  history: History;
}

const RegisterPage: FC<RegisterPageProps> = ({history}) => {
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [sumbnailDataURI, setSumbnailDataURI] = useState<string | null>(null);

  const onSumbnailSelected = useCallback(e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const originBuf = new Buffer(reader.result as ArrayBuffer);
        Jimp.read(originBuf)
          .then(lenna => lenna.cover(256, 256).getBase64Async(Jimp.MIME_JPEG))
          .then(base64 => setSumbnailDataURI(base64));
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  return (
    <>
      <Header title="登録" />
      <Container>
        <InputItem>
          <Label>作家名 :</Label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </InputItem>
        <InputItem>
          <Label>作家名（英語） :</Label>
          <Input
            type="text"
            value={englishName}
            onChange={e => setEnglishName(e.target.value)}
          />
        </InputItem>
        <InputItem>
          <Label>サムネイルに使用する画像 :</Label>
          <SumbnailSelectButton
            type="file"
            accept="image/*"
            onChange={onSumbnailSelected}
          />
          <SumbnailPreview src={sumbnailDataURI || ''} />
        </InputItem>
        <RegisterButton
          onClick={() => {
            if (name === '') {
              alert('作家名を入力してください');
              return;
            }
            if (englishName === '') {
              alert('作家名(英語)を入力してください');
              return;
            }
            if (sumbnailDataURI === null) {
              alert('サムネイルに使用する画像を選択してください');
              return;
            }
            const user = firebase.auth().currentUser;
            if (user === null) {
              alert('まずメールアドレスを登録してください');
              history.push('/signin');
              return;
            }
            Promise.all([
              uploadArtistSumbnail(user, sumbnailDataURI),
              uploadArtistCollection(user, name, englishName),
            ]).then(() => {
              alert('登録に成功しました');
              history.push('/account/');
            });
          }}>
          登録
        </RegisterButton>
      </Container>
    </>
  );
};

export default RegisterPage;

function uploadArtistSumbnail(
  user: firebase.User,
  dataURI: string,
): Promise<void> {
  const base64 = extractBase64FromDataURI(dataURI) as string;
  return firebase
    .storage()
    .ref(`/artists/${user.uid}/sumbnail.jpg`)
    .putString(base64, 'base64', {contentType: 'image/jpeg'})
    .then();
}

function extractBase64FromDataURI(dataURI: string): string | null {
  const re = /base64,(.*)/;
  const found = dataURI.match(re);
  if (found) {
    return found[1];
  } else {
    return null;
  }
}

function uploadArtistCollection(
  user: firebase.User,
  name: string,
  englishName: string,
): Promise<void> {
  const displayId = toDisplayId(englishName);
  return firebase
    .firestore()
    .collection('artists')
    .doc(user.uid)
    .set({
      name: name,
      englishName: englishName,
      displayId: displayId,
    });
}

function toDisplayId(englishName: string): string {
  return englishName
    .split(' ')
    .join('_')
    .toLowerCase();
}

const Container = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 30px;
`;

const InputItem = styled.div`
  margin-top: 50px;

  &:first-of-type {
    margin-top: 0px;
  }
`;

const Label = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 4px;
  padding-left: 20px;
  border: 1px solid lightgray;
`;

const SumbnailSelectButton = styled.input`
  height: 40px;
  border-radius: 4px;
  border: 1px solid lightgray;
  text-align: center;
`;

const SumbnailPreview = styled(Sumbnail)`
  width: 100%;
  margin-top: 20px;
  border-radius: 4px;
  border: 1px solid lightgray;
`;

const RegisterButton = styled.button`
  display: block;
  width: 200px;
  height: 50px;
  margin: 0 auto;
  margin-top: 50px;
  font-size: 14px;
  text-align: center;
  background-color: black;
  color: white;
`;
