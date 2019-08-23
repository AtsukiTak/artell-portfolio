import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from 'services/index';
import {getArtistByName} from 'services/artist';
import Header from '../components/header';
import {pc, MinPcWidth} from 'components/responsive';

import ProfileComponent from './artist/components/profile';
import ArtsComponent from './artist/components/arts';

interface ArtistPageProps {
  artistName: string;
}

const ArtistPage: React.FC<ArtistPageProps> = ({artistName}) => {
  const artist = useSelector((state: RootState) =>
    state.artist.list.find(artist => artist.name === artistName),
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!artist) {
      dispatch(getArtistByName(artistName));
    }
  }, [artistName, artist, dispatch]);

  return (
    <>
      <Header title={artistName} />
      <Contents>
        {artist != null ? (
          <>
            <ProfileComponent artist={artist} />
            <HR />
            <ArtsComponent artist={artist} />
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
