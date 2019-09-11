import React, { FC, useState } from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import { useDispatch } from "react-redux";

import { UploadImage, ArtAttributes, ArtRepository } from "artell-models";

import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";
import { useRouter } from "components/router";

import SumbnailComponent from "./add/components/sumbnail";
import AttributesComponent from "./add/components/attributes";

const AddArtPage: FC<UserProps> = ({ user }) => {
  const { history } = useRouter();
  const [thumbnail, setThumbnail] = useState<UploadImage | null>(null);
  const [attrs, setAttrs] = useState<ArtAttributes>({
    title: "",
    widthMM: 0,
    heightMM: 0,
    description: "",
    materials: "",
    priceYen: 0
  });
  const dispatch = useDispatch();

  const onSubmitClick = async () => {
    if (thumbnail === null) {
      alert("作品の画像が選択されていません。");
    } else {
      const newArt = await new ArtRepository(firebase.app()).create(
        user.artist,
        attrs,
        thumbnail
      );
      alert("新しい作品を追加しました！");
      dispatch(setUser(user.artist, [...user.arts, newArt]));
      history.push("/settings/arts");
    }
  };

  return (
    <>
      <Header title="作品追加" />
      <Container>
        <SumbnailComponent thumbnail={thumbnail} setThumbnail={setThumbnail} />
        <AttributesComponent attrs={attrs} setAttrs={setAttrs} />
        <SubmitButton onClick={onSubmitClick}>追加</SubmitButton>
      </Container>
    </>
  );
};

export default withUser(AddArtPage);

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
