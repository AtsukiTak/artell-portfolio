import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import Header from '../components/header';
import Sumbnail from '../components/sumbnail';
import * as logo from '../components/logo';
import {Art, Artist, fetchArtist, fetchArtsOfArtist} from 'models/artist';

interface ArtistPageProps {
  displayId: string;
}

const ArtistPage: FC<ArtistPageProps> = ({displayId}) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    fetchArtist(displayId)
      .then(artist => {
        setArtist(artist);
        return fetchArtsOfArtist(artist.uid);
      })
      .then(arts => setArts(arts));
  }, [displayId]);

  const Contents = styled.div`
    width: 80%;
    max-width: 780px;
    margin: 50px auto;

    @media (min-width: 970px) {
      margin-top: 90px;
    }
  `;

  return (
    <>
      <Header title={artist != null ? artist.name : ''} />
      <Contents>
        {artist != null ? (
          <>
            <Profile artist={artist} />
            <Arts artist={artist} arts={arts} />
          </>
        ) : null}
      </Contents>
    </>
  );
};

export default ArtistPage;

const Profile: FC<{artist: Artist}> = ({artist}) => {
  const Container = styled.div`
    width: 100%;
  `;

  const StyledSumbnail = styled(Sumbnail)`
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;

    @media (min-width: 970px) {
      display: inline-block;
      width: 400px;
    }
  `;

  const TextContent = styled.div`
    display: inline-block;
    vertical-align: top;
    width: 100%;
    margin-top: 18px;

    @media (min-width: 970px) {
      width: 266px;
      margin-top: 0;
      padding-left: 110px;
    }
  `;

  const Name = styled.div`
    width: 100%;
    font-family: NotoSansCJKjp-Light;
    color: 000000;
    text-align: right;
    font-size: 24px;
  `;

  const Sns = styled.div`
    width: 100%;
    text-align: right;
    margin-top: 10px;

    & > svg {
      width: 18px;
      height: 18px;
      margin-left: 15px;
    }
  `;

  const Description = styled.div`
    width: 100%;
    margin-top: 25px;
    font-family: NotoSansCJKjp-Regular;
    color: #505050;
    font-size: 16px;
    line-height: 32px;

    @media (min-width: 970px) {
      font-size: 14px;
      line-height: 28px;
    }
  `;

  const HR = styled.hr`
    width: 100%;
    margin-top: 65px;
    border: 0.5px solid #979797;

    @media (min-width: 970px) {
      margin-top: 90px;
    }
  `;

  return (
    <Container>
      <StyledSumbnail src={artist.sumbnailUrl} />
      <TextContent>
        <Name>{artist.name}</Name>
        <Sns>
          <logo.Facebook />
          <logo.Twitter />
          <logo.Instagram />
        </Sns>
        <Description>{artist.description}</Description>
      </TextContent>
      <HR />
    </Container>
  );
};

const Arts: FC<{artist: Artist; arts: Art[]}> = ({artist, arts}) => {
  const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @media (min-width: 450px) {
      justify-content: space-between;
    }
  `;

  const Art = styled.div`
    width: 180px;
    margin-top: 80px;
  `;

  const StyledSumbnail = styled(Sumbnail)`
    width: 100%;
  `;

  const Title = styled.div`
    width: 100%;
    font-family: NotoSansCJKjp-Bold;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0.44px;
    text-align: center;
    margin-top: 15px;
  `;

  return (
    <Container>
      {arts.map(art => (
        <Art key={art.title}>
          <Link to={`/${artist.displayId}/${art.id}/`}>
            <StyledSumbnail src={art.sumbnailUrl} />
          </Link>
          <Title>{art.title}</Title>
        </Art>
      ))}
    </Container>
  );
};
