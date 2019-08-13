import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';

import Header from '../components/header';
import {pc, MinPcWidth} from 'components/responsive';
import {Art, Artist, fetchArtistByName, fetchArtsOfArtist} from 'models/artist';

import ProfileComponent from './artist/components/profile';
import ArtsComponent from './artist/components/arts';

interface ArtistPageProps {
  artistName: string;
}

const ArtistPage: FC<ArtistPageProps> = ({artistName}) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    fetchArtistByName(artistName).then(artist => {
      if (artist === null) {
        alert('指定のアーティストが見つかりません');
      } else {
        setArtist(artist);
        fetchArtsOfArtist(artist).then(arts => setArts(arts));
      }
    });
  }, [artistName]);

  return (
    <>
      <Header title={artistName} />
      <Contents>
        {artist != null ? (
          <>
            <ProfileComponent artist={artist} />
            <HR />
            <ArtsComponent artist={artist} arts={arts} />
          </>
        ) : null}
      </Contents>
    </>
  );
};

const Contents = styled.div`
  width: 80%;
  max-width: ${MinPcWidth}px;
  margin: 50px auto;

  ${pc(`
    margin-top: 90px;
  `)}
`;

const HR = styled.hr`
  width: 100%;
  margin-top: 65px;
  border: 0.5px solid #979797;

  ${pc(`
    margin-top: 90px;
  `)}
`;

export default ArtistPage;
