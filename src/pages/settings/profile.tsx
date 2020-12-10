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
import Footer from "components/footer";
import SelectImageComponent from "components/select_image";

import SettingTab from "components/settings/tab";
import EditAttributesComponent from "components/settings/profile/edit_attributes";

const ProfileSettingPage: React.FC<UserProps> = ({ user }) => {
  const { artist, arts } = user;
  const [attrs, setAttrs] = useState<ArtistAttributes>(artist.attrs);
  const [thumbnail, setThumbnail] = useState<Image | null>(artist.thumbnail);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  // Updateボタンが押された時に実行される関数
  const onSubmit = async () => {
    setUpdating(true);

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
      <Header />
      <SettingTab selected="tab1" />
      <Container>
        <LinkToArtistPage to={`/${artist.uid}`}>
          自分の作家ページをプレビューする →
        </LinkToArtistPage>
        <SelectImageComponent
          image={thumbnail || ArtistDefaultThumbnail}
          setImage={setThumbnail}
        />
        <EditAttributesComponent attrs={attrs} setAttrs={setAttrs} />
        {updating ? (
          <UpdateButton disabled>Updating...</UpdateButton>
        ) : (
          <UpdateButton onClick={onSubmit}>プロフィールを更新する</UpdateButton>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default withUser(ProfileSettingPage);

const ArtistDefaultThumbnail = DownloadImage.download(
  "/img/artist-default-thumbnail.jpg"
);

const Container = styled.div`
  width: 100%;
  margin: 0px auto;
  padding: 50px 20px;

  ${pc(`
    width: 86%;
    margin-top: 90px;
    padding: 50px 0px;
  `)}
`;

const LinkToArtistPage = styled(Link)`
  display: block;
  margin-bottom: 20px;
  font-size: 12px;
  line-height: 1.45;
  letter-spacing: 0.46px;
  text-decoration: underline;
  text-align: right;
  color: #333333;

  &:visited {
    color: #586069;
  }

  ${pc(`
    font-size: 16px;
    text-align: left;
  `)}
`;

const UpdateButton = styled.button`
  display: block;
  width: 100%;
  height: 51px;
  margin: 30px auto 0 auto;
  background: white;
  border-radius: 2px;
  border: solid 1px #333;
  font-size: 13px;
  letter-spacing: 1.18px;
  color: #333333;
  font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
    sans-serif;
  ${pc(`
    font-size: 14px;
  `)}
`;
