import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {MobileContent, PcContent} from 'components/responsive';
import {Art, fetchArtistByDisplayId, fetchArt, Artist} from 'models/artist';

interface ArtPageProps {
  artistDisplayId: string;
  artId: string;
}

const ArtPage: FC<ArtPageProps> = ({artistDisplayId, artId}) => {
  const [art, setArt] = useState<Art | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetchArtistByDisplayId(artistDisplayId).then(artist => {
      if (artist === null) {
        alert('アーティストが見つかりません');
      } else {
        setArtist(artist);
        fetchArt(artist.uid, artId).then(art => {
          if (art === null) {
            alert('指定の作品が見つかりません');
          } else {
            setArt(art);
          }
        });
      }
    });
  }, [artistDisplayId, artId]);

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

  return (
    <>
      <CloseButton to={`/${artistDisplayId}/`} />
      {art != null && artist != null ? (
        <>
          <MobileContent>
            <Mobile art={art} artist={artist} />
          </MobileContent>
          <PcContent>
            <Pc art={art} artist={artist} />
          </PcContent>
        </>
      ) : null}
    </>
  );
};

export default ArtPage;

const Mobile: FC<{art: Art; artist: Artist}> = ({art, artist}) => {
  const ArtContaier = styled('div')<{src: string}>`
    width: 90vw;
    height: 80vh;
    margin: 0 auto;
    background-image: url(${({src}) => src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  `;

  const CaptionContainer = styled.div`
    width: calc(100vw - 112px);
    height: 20vh;
    border-top: solid 1px #d8d8d8;
    padding: 25px 56px;
  `;

  const ArtistName = styled.div`
    font-family: NotoSansCJKjp-Light;
    font-size: 16px;
    color: #484848;
    line-height: 24px;
  `;

  const Info = styled.div`
    margin-top: 8px;
    font-family: NotoSansCJKjp-Light;
    font-size: 12px;
    color: #a1a1a1;
    line-height: 18px;
  `;

  return (
    <>
      <ArtContaier src={art.sumbnailUrl} />
      <CaptionContainer>
        <ArtistName>{artist.name}</ArtistName>
        <Info>{`${art.title}, 2018hoge`}</Info>
        <Info>{`Acrylic, transfers, colored pencil, charcoal, and pastel on paper`}</Info>
        <Info>{`215.9 x 266.7 cm`}</Info>
      </CaptionContainer>
    </>
  );
};

const Pc: FC<{art: Art; artist: Artist}> = ({art, artist}) => {
  const ArtContainer = styled('div')<{src: string}>`
    display: inline-block;
    width: calc(100vw - 385px);
    height: 100vh;
    background-image: url(${({src}) => src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  `;

  const CaptionContainer = styled.div`
    display: inline-block;
    position: relative;
    width: 225px;
    margin-left: 60px;
    bottom: 150px;
  `;

  const ArtistName = styled.div`
    font-family: NotoSansCJKjp-Light;
    font-size: 18px;
    color: #484848;
  `;

  const Info = styled.div`
    margin-top: 8px;
    font-family: NotoSansCJKjp-Light;
    font-size: 14px;
    color: #a1a1a1;
  `;

  return (
    <>
      <ArtContainer src={art.sumbnailUrl} />
      <CaptionContainer>
        <ArtistName>{artist.name}</ArtistName>
        <Info>{`${art.title}, 2018`}</Info>
        <Info>{`Acrylic, transfers, colored pencil, charcoal, and pastel on paper`}</Info>
        <Info>{`215.9 x 266.7 cm`}</Info>
      </CaptionContainer>
    </>
  );
};
