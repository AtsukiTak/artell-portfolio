import React, { useState } from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Image, DownloadImage } from "models/image";
import { Artist, ArtistAttributes, ArtistRepository } from "models/artist";

import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";
import { PrimaryButton } from "components/button";
import SelectImageComponent from "components/select_image";

import SettingTab from "./components/tab";
import EditAttributesComponent from "./profile/components/edit_attributes";

const ProfileSettingPage: React.FC<UserProps> = ({ user }) => {
  const { artist, arts } = user;
  const [attrs, setAttrs] = useState<ArtistAttributes>(artist.attrs);
  const [thumbnail, setThumbnail] = useState<Image | null>(artist.thumbnail);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  // Updateボタンが押された時に実行される関数
  const onSubmit = async () => {
    setUpdating(true);

    const artistRepo = new ArtistRepository(firebase.app());
    // まず同名アーティストがいないか確認
    if (await artistRepo.checkExistenceByName(attrs.name)) {
      alert("同名の作家が既に登録されています");
      setUpdating(false);
      return;
    }

    // 作家情報を更新
    const newArtist = new Artist(artist.uid, attrs, thumbnail);
    if (newArtist.attrs !== artist.attrs) {
      await new ArtistRepository(firebase.app()).updateAttrs(newArtist);
    }
    if (newArtist.thumbnail !== artist.thumbnail) {
      await new ArtistRepository(firebase.app()).updateThumbnail(newArtist);
    }
    dispatch(setUser(newArtist, arts));
    alert("更新が完了しました");
    setUpdating(false);
  };

  return (
    <>
      <Header title="Settings" />
      <SettingTab selected="tab1" />
      <Container>
        <LinkToArtistPage to={`/${artist.urlName()}`}>
          自分の作家ページへ →
        </LinkToArtistPage>
        <SelectImageComponent
          image={thumbnail || ArtistDefaultThumbnail}
          setImage={setThumbnail}
        />
        <EditAttributesComponent attrs={attrs} setAttrs={setAttrs} />
        {updating ? (
          <UpdateButton disabled>Updating...</UpdateButton>
        ) : (
          <UpdateButton onClick={onSubmit}>Update</UpdateButton>
        )}
      </Container>
    </>
  );
};

export default withUser(ProfileSettingPage);

const ArtistDefaultThumbnail = new DownloadImage(
  "/img/artist-default-thumbnail.jpg"
);

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  padding: 50px 0;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const LinkToArtistPage = styled(Link)`
  display: block;
  margin-bottom: 20px;
  text-decoration: underline;
  color: #586069;

  &:visited {
    color: #586069;
  }
`;

const UpdateButton = styled(PrimaryButton)`
  display: block;
  margin: 30px auto 0 auto;
`;
