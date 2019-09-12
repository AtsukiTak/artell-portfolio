import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import * as firebase from "firebase/app";
import { Link } from "react-router-dom";

import {
  Image,
  Art,
  ArtAttributes,
  ArtRepository,
  Artist
} from "artell-models";

import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";
import { PrimaryButton } from "components/button";
import SelectImageComponent from "components/select_image";

import EditAttributesComponent from "./edit/components/edit_attributes";

interface Props {
  artId: string;
}

const ArtEditPageWrapper: React.FC<UserProps & Props> = ({ user, artId }) => {
  const art = user.arts.find(art => art.id === artId);
  if (!art) {
    return null;
  } else {
    return <ArtEditPage user={user} art={art} />;
  }
};

export default withUser(ArtEditPageWrapper);

const ArtEditPage: React.FC<{
  user: { artist: Artist; arts: Art[] };
  art: Art;
}> = ({ user, art }) => {
  const [thumbnail, setThumbnail] = useState<Image>(art.thumbnail);
  const [attrs, setAttrs] = useState<ArtAttributes>(art.attrs);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const newArt = new Art(art.id, attrs, thumbnail);
    setUpdating(true);
    if (newArt.attrs !== art.attrs) {
      await new ArtRepository(firebase.app()).updateAttrs(user.artist, newArt);
    }
    if (newArt.thumbnail !== art.thumbnail) {
      await new ArtRepository(firebase.app()).updateThumbnail(
        user.artist,
        newArt
      );
    }
    const newArts = user.arts.map(art => (art.id === newArt.id ? newArt : art));
    dispatch(setUser(user.artist, newArts));
    setUpdating(false);
  };

  return (
    <>
      <Header title="Settings" />
      <Container>
        <LinkToArtPage to={`/${user.artist.attrs.name}/${art.id}`}>
          作品ページへ →
        </LinkToArtPage>
        <SelectImageComponent image={thumbnail} setImage={setThumbnail} />
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

const Container = styled.div`
  width: 80%;
  margin: 0px auto;
  padding: 50px 0;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const LinkToArtPage = styled(Link)`
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
