import React, { useState } from "react";
import styled from "styled-components";
import * as firebase from "firebase/app";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  Image,
  Artist,
  ArtistAttributes,
  ArtistRepository
} from "artell-models";

import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";

import SettingTab from "./components/tab";
import EditThumbnailComponent from "./profile/components/edit_thumbnail";
import EditAttributesComponent from "./profile/components/edit_attributes";

const ProfileSettingPage: React.FC<UserProps> = ({ user }) => {
  const { artist, arts } = user;
  const [attrs, setAttrs] = useState<ArtistAttributes>(artist.attrs);
  const [thumbnail, setThumbnail] = useState<Image | null>(artist.thumbnail);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const newArtist = new Artist(artist.uid, attrs, thumbnail);
    setUpdating(true);
    if (newArtist.attrs !== artist.attrs) {
      await new ArtistRepository(firebase.app()).updateAttrs(newArtist);
    }
    if (newArtist.thumbnail !== artist.thumbnail) {
      await new ArtistRepository(firebase.app()).updateThumbnail(newArtist);
    }
    dispatch(setUser(newArtist, arts));
    setUpdating(false);
  };

  return (
    <>
      <Header title="Settings" />
      <SettingTab selected="tab1" />
      <Container>
        <LinkToArtistPage to={`/${artist.attrs.name}`}>
          自分の作家ページへ →
        </LinkToArtistPage>
        <EditThumbnailComponent
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
        />
        <EditAttributesComponent attrs={attrs} setAttrs={setAttrs} />
        {updating ? (
          <SubmitButton disabled>Updating...</SubmitButton>
        ) : (
          <SubmitButton onClick={onSubmit}>Update</SubmitButton>
        )}
      </Container>
    </>
  );
};

export default withUser(ProfileSettingPage);

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

const SubmitButton = styled.button`
  display: block;
  width: 100px;
  height: 40px;
  margin: 30px auto 0 auto;
  border: none;
  border-radius: 4px;
  background: linear-gradient(-180deg, #32d058, #28a745 90%);
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  color: white;

  &:disabled {
    background: lightgray;
  }
`;
