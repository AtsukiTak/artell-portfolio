import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import * as firebase from "firebase/app";

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

import EditThumbnailComponent from "./edit/components/edit_thumbnail";
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
  margin: 30px auto 0 auto;
  border: none;
  border-radius: 4px;
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  color: white;
`;
