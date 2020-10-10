import React, { FC, useState } from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import { useDispatch } from "react-redux";

import { DownloadImage, UploadImage } from "models/image";
import { ArtAttributes, ArtRepository } from "models/art";
import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { useRouter } from "components/router";
import Header from "components/header";
import SelectImageComponent from "components/select_image";
import CircularProgress from "@material-ui/core/CircularProgress";

import AttributesComponent from "./components/edit_attributes";

const AddArtPage: FC<UserProps> = ({ user }) => {
  const { history } = useRouter();
  const [thumbnail, setThumbnail] = useState<UploadImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attrs, setAttrs] = useState<ArtAttributes>({
    title: "",
    widthMM: 0,
    heightMM: 0,
    description: "",
    materials: "",
    showPublic: true,
    salesPriceYen: 29800,
    rentalPriceYen: 4980
  });
  const dispatch = useDispatch();

  const onSubmitClick = async () => {
    if (thumbnail === null) {
      alert("作品の画像が選択されていません。");
    } else {
      setIsLoading(true);
      const newArt = await new ArtRepository(firebase.app()).create(
        user.artist,
        attrs,
        thumbnail
      );
      setIsLoading(false);
      alert("新しい作品を追加しました！");
      dispatch(setUser(user.artist, [...user.arts, newArt]));
      history.push("/settings/arts");
    }
  };

  if (isLoading) {
    return (
      <ProgressContainer>
        <CircularProgress size={50} thickness={2} />
      </ProgressContainer>
    )
  } else {
    return (
      <>
        <Header />
        <Container>
          <AttributeName>作品の写真 / Picture of the piece</AttributeName>
          <SelectImageComponent
            image={thumbnail || AddArtThumbnail}
            setImage={img => setThumbnail(img)}
          />
          <AttributesComponent attrs={attrs} setAttrs={setAttrs} />
          <SubmitButton onClick={onSubmitClick}>作品を登録</SubmitButton> 
        </Container>
      </>
    )
  };
};

export default withUser(AddArtPage);

const AddArtThumbnail = DownloadImage.download("/img/add-art-thumbnail.png");

const Container = styled.div`
  width: 86%
  margin: 0px auto;
  padding: 20px 0;
`;

const AttributeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333333;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  height: 51px;
  margin: 30px auto 0 auto;
  background: white;
  border-radius: 2px;
  border: solid 1.5px #666666;
  font-size: 13px;
  letter-spacing: 1.18px;
  color: #333333;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(0%) translateX(-50%);
  -webkit-transform: translateY(0%) translateX(-50%);
  width: 50px;
  margin: 40vh auto;
`;
