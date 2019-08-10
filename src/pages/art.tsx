import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {pc} from 'components/responsive';
import {Art, fetchArtistByName, fetchArtByTitle, Artist} from 'models/artist';

interface ArtPageProps {
  artistName: string;
  artTitle: string;
}

const ArtPage: FC<ArtPageProps> = ({artistName, artTitle}) => {
  const [art, setArt] = useState<Art | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetchArtistByName(artistName).then(artist => {
      if (artist === null) {
        alert('アーティストが見つかりません');
      } else {
        setArtist(artist);
        fetchArtByTitle(artist, artTitle).then(art => {
          if (art === null) {
            alert('指定の作品が見つかりません');
          } else {
            setArt(art);
          }
        });
      }
    });
  }, [artistName, artTitle]);

  return (
    <>
      <CloseButton to={`/${artistName}/`} />
      {art != null && artist != null ? (
        <>
          <ArtContainer src={art.sumbnailUrl} />
          <CaptionContainer>
            <ArtistName>{artist.name}</ArtistName>
            <Info>{art.title}</Info>
            <Info>{art.materials}</Info>
            <Info>{`${art.widthMM} x ${art.heightMM} mm`}</Info>
          </CaptionContainer>
        </>
      ) : null}
    </>
  );
};

export default ArtPage;

const CloseButton = styled(Link)`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 40px;
  height: 40px;

  @media (min-width: 700px) {
    right: 60px;
    top: calc(100vh - 40px - 40px);
  }

  &:before,
  &:after {
    position: absolute;
    left: 30px;
    content: ' ';
    height: 41px;
    width: 2px;
    background-color: #d8d8d8;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

const ArtContainer = styled('div')<{src: string}>`
  width: 90vw;
  height: 80vh;
  margin: 0 auto;
  background-image: url(${({src}) => src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  ${pc(`
    display: inline-block;
    width: calc(100vw - 385px);
    height: 100vh;
    margin: 0;
  `)}
`;

const CaptionContainer = styled.div`
  min-height: 20vh;
  border-top: solid 1px #d8d8d8;
  padding: 25px 56px;

  ${pc(`
    border-top: none;
    padding: 0px;

    display: inline-block;
    position: relative;
    width: 225px;
    margin-left: 60px;
    bottom: 150px;
  `)}
`;

const ArtistName = styled.div`
  font-family: NotoSansCJKjp-Light;
  font-size: 16px;
  color: #484848;
  line-height: 24px;

  ${pc(`
    font-size: 18px;
  `)}
`;

const Info = styled.div`
  font-size: 14px;
  color: #a1a1a1;
  margin-top: 8px;
  font-family: NotoSansCJKjp-Light;
  line-height: 18px;
`;
