import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import Sumbnail from '../components/sumbnail';
import * as logo from '../components/logo';
import {MobileContent, PcContent} from '../components/responsive';
import {Artist} from '../models/artist';
import {Art} from '../models/art';
import {getArtist, getArt} from '../api';

interface ArtPageProps {
  artistId: string;
  artId: string;
}

const ArtPage: FC<ArtPageProps> = ({artistId, artId}) => {
  const [art, setArt] = useState<Art | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    getArt(artId).then(art => {
      setArt(art);
    });
    getArtist(artistId).then(artist => {
      setArtist(artist);
    });
  }, [artistId, artId]);

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
      <CloseButton to={`/${artistId}/`} />
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
      <ArtContaier src={art.image_url} />
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
      <ArtContainer src={art.image_url} />
      <CaptionContainer>
        <ArtistName>{artist.name}</ArtistName>
        <Info>{`${art.title}, 2018`}</Info>
        <Info>{`Acrylic, transfers, colored pencil, charcoal, and pastel on paper`}</Info>
        <Info>{`215.9 x 266.7 cm`}</Info>
      </CaptionContainer>
    </>
  );
};
