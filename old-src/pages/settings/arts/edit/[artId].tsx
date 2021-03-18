import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import * as firebase from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/router";

import { Image } from "models/image";
import { Art, ArtAttributes, ArtRepository } from "models/art";
import { Artist } from "models/artist";
import { setUser } from "services/login";
import { withUser, UserProps } from "components/with-user";
import { pc } from "components/responsive";
import Header from "components/header";
import { PrimaryButton, DangerButton } from "components/button";
import SelectImageComponent from "components/select_image";

import EditAttributesComponent from "components/settings/arts/edit_attributes";

interface Props {
  artId: string;
}

const ArtEditPageWrapper: React.FC<UserProps & Props> = ({ user, artId }) => {
  const art = user.arts.find((art) => art.id === artId);
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
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState<Image>(art.thumbnail);
  const [attrs, setAttrs] = useState<ArtAttributes>(art.attrs);
  const [requesting, setRequesting] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const newArt = new Art(art.id, attrs, thumbnail);
    setRequesting(true);
    if (newArt.attrs !== art.attrs) {
      await new ArtRepository(firebase.app()).updateAttrs(user.artist, newArt);
    }
    if (newArt.thumbnail !== art.thumbnail) {
      await new ArtRepository(firebase.app()).updateThumbnail(
        user.artist,
        newArt
      );
    }
    const newArts = user.arts.map((art) =>
      art.id === newArt.id ? newArt : art
    );
    dispatch(setUser(user.artist, newArts));
    setRequesting(false);
  };

  const onDelete = async () => {
    setRequesting(true);
    if (window.confirm("本当にこの作品を削除しますか？")) {
      const artRepo = new ArtRepository(firebase.app());
      console.log(artRepo);
      await artRepo.deleteArt(user.artist, art);
      const newUserArts = user.arts.filter((a) => a.id !== art.id);
      dispatch(setUser(user.artist, newUserArts));
      router.push("/settings/arts");
    }
    setRequesting(false);
  };

  return (
    <>
      <Header />
      <Container>
        <Link href={`/${user.artist.uid}/${art.id}`} passHref>
          <LinkToArtPage>作品ページへ →</LinkToArtPage>
        </Link>
        <SelectImageComponent image={thumbnail} setImage={setThumbnail} />
        <EditAttributesComponent attrs={attrs} setAttrs={setAttrs} />
        <Buttons>
          {requesting ? (
            <>
              <UpdateButton disabled>Update</UpdateButton>
              <DangerButton disabled>Delete</DangerButton>
            </>
          ) : (
            <>
              <UpdateButton onClick={onSubmit}>Update</UpdateButton>
              <DangerButton onClick={onDelete}>Delete</DangerButton>
            </>
          )}
        </Buttons>
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

const LinkToArtPage = styled.a`
  display: block;
  margin-bottom: 20px;
  text-decoration: underline;
  color: #586069;

  &:visited {
    color: #586069;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
`;

const UpdateButton = styled(PrimaryButton)`
  display: block;
`;
