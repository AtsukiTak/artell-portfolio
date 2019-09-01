import React, {FC, useState} from 'react';
import styled from 'styled-components';
import {History} from 'history';
import {withRouter} from 'react-router-dom';

import {UploadImage} from 'models/image';
import {ArtAttributes, ArtRepository} from 'models/art';
import {withUser, UserProps} from 'components/with-user';
import {pc} from 'components/responsive';
import Header from 'components/header';

import SumbnailComponent from './add/components/sumbnail';
import AttributesComponent from './add/components/attributes';

const AddArtPage: FC<UserProps & {history: History}> = ({user, history}) => {
  const [thumbnail, setThumbnail] = useState<UploadImage | null>(null);
  const [attrs, setAttrs] = useState<ArtAttributes>({
    title: '',
    widthMM: 0,
    heightMM: 0,
    description: '',
    materials: '',
    priceYen: 0,
  });

  const onSubmitClick = async () => {
    if (thumbnail === null) {
      alert('アートの画像が選択されていません。');
    } else {
      await ArtRepository.create(user.artist, attrs, thumbnail);
      alert('新しいアートを追加しました！');
      history.push('/settings/arts');
    }
  };

  return (
    <>
      <Header title="アート追加" />
      <Container>
        <SumbnailComponent thumbnail={thumbnail} setThumbnail={setThumbnail} />
        <AttributesComponent attrs={attrs} setAttrs={setAttrs} />
        <SubmitButton onClick={onSubmitClick}>追加</SubmitButton>
      </Container>
    </>
  );
};

export default withRouter(withUser(AddArtPage));

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  margin-top: 50px;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const SubmitButton = styled.button`
  display: block;
  width: 100px;
  height: 40px;
  margin: 0 auto;
  margin-top: 30px;
  border: none;
  border-radius: 4px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  color: white;
`;
