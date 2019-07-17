import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';

import Header from '../components/header';
import {onPc} from 'components/responsive';
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
        fetchArtsOfArtist(artist.uid).then(arts => setArts(arts));
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
            <ArtsComponent artist={artist} arts={arts} />
          </>
        ) : null}
      </Contents>
    </>
  );
};

const Contents = styled.div`
  width: 80%;
  max-width: 780px;
  margin: 50px auto;

  ${onPc(`
    margin-top: 90px;
  `)}
`;

export default ArtistPage;
