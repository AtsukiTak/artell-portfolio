import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { Art } from "models/art";
import { Artist } from "models/artist";
import { pc } from "components/Responsive";
import { DataURI } from "libs/image";
import * as color from "libs/colors";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { Text } from "components/atoms/Text";
import ImageSelector from "components/molecules/ImageSelector";
import Header from "components/organisms/Header";
import Footer from "components/organisms/Footer";
import SettingTab from "components/organisms/settings/SettingTab";
import EditAttributes from "components/organisms/settings/profile/EditAttributes";

type Props = {
  artist: Artist;
  onSave: (data: SaveData) => Promise<void>;
};

type SaveData = {
  thumbnailBase64Data: string | null;
  name: string;
  comment: string;
  description: string;
  twitter: string;
  facebook: string;
  instagram: string;
};

const ProfileSettingPageTemplate: React.FC<Props> = ({ artist, onSave }) => {
  // ユーザーが新しく選択したサムネイル画像
  const [
    selectedThumbnail,
    setSelectedThumbnail,
  ] = React.useState<DataURI | null>(null);

  // 現在の画面に表示するサムネイル画像
  const displayThumbnail =
    selectedThumbnail ||
    artist.thumbnailUrl ||
    "/img/artist-default-thumbnail.jpg";

  // 現在入力中のアーティスト情報
  const [updatedArtist, setUpdatedArtist] = React.useState(artist);

  // 更新中かどうかのフラグ
  const [isSaving, setIsSaving] = React.useState(false);
  const onSaveClick = React.useCallback(() => {
    setIsSaving(true);
    onSave({
      ...updatedArtist,
      thumbnailBase64Data: selectedThumbnail?.getBase64() || null,
    }).then(() => setIsSaving(false));
  }, [updatedArtist, selectedThumbnail, onSave]);

  return (
    <>
      <Header />
      <SettingTab selected="tab1" />
      <Container size="md">
        <Spacer size="5vh" />
        <Link href={`/${artist.uid}`} passHref>
          <LinkToArtistPage>自分の作家ページを見る →</LinkToArtistPage>
        </Link>
        <ImageSelector
          value={displayThumbnail}
          onSelect={setSelectedThumbnail}
        />
        <EditAttributes attrs={updatedArtist} onUpdate={setUpdatedArtist} />
        <Spacer size="30px" />
        <Button
          border={isSaving ? color.gray30 : color.gray80}
          bg={color.white}
          disabled={isSaving}
          onClick={onSaveClick}
        >
          <Text size={0.8} color={isSaving ? color.gray30 : color.gray80}>
            プロフィールを更新する
          </Text>
        </Button>
      </Container>
      <Footer />
    </>
  );
};

const LinkToArtistPage = styled.a`
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

export default ProfileSettingPageTemplate;
