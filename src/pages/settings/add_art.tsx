import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import {Link} from 'react-router-dom';
import {History} from 'history';

import {onPc} from 'components/responsive';
import Header from 'components/header';
import {StoredArt, updateArtSumbnail, updateArt} from 'models/artist';

import SumbnailComponent from './add_art/components/sumbnail';
import AttributesComponent from './add_art/components/attributes';

interface Props {
  fbUser: firebase.User | null;
  history: History;
}

const AddArtPageWrapper: FC<Props> = ({fbUser, history}) => {
  if (fbUser === null) {
    return (
      <div>
        <h3>
          <Link to="/signin">ログイン</Link>が必要です
        </h3>
      </div>
    );
  } else {
    return <AddArtPage fbUser={fbUser} history={history} />;
  }
};

export default AddArtPageWrapper;

interface AddArtPageProps {
  fbUser: firebase.User;
  history: History;
}

const AddArtPage: FC<AddArtPageProps> = ({fbUser, history}) => {
  const [sumbnailBase64, setSumbnailBase64] = useState<string | null>(null);
  const [attrs, setAttrs] = useState<StoredArt | null>(null);

  const onSubmitClick = () => {
    if (sumbnailBase64 === null) {
      alert('アートの画像が選択されていません。');
    } else if (attrs === null) {
      alert('入力されていない項目があります。');
    } else {
      Promise.all([
        // updateArtSumbnail(fbUser, attrs.title, sumbnailBase64),
        updateArt(fbUser, attrs.title, attrs),
      ]).then(() => {
        alert('新しいアートを追加しました！');
        history.push('/settings/profile');
      });
    }
  };

  return (
    <>
      <Header title="アート追加" displaySigninLink={false} />
      <Container>
        <SumbnailComponent
          fbUser={fbUser}
          onSumbnailSelected={setSumbnailBase64}
        />
        <AttributesComponent fbUser={fbUser} onAttributeChange={setAttrs} />
        <SubmitButton onClick={onSubmitClick}>追加</SubmitButton>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  margin-top: 50px;

  ${onPc(`
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
