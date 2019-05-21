import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Header from '../components/header';
import Footer from '../components/footer';
import Sumbnail from '../components/sumbnail';
import { Artist } from '../models/artist';
import { getArtists } from '../api';

const TopPage = () => {
  const [artists, setArtists] = useState<Array<Artist>>([]);

  useEffect(() => {
    getArtists()
      .then(artists => setArtists(artists));
  }, []);


  const Items = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: calc(100% * 13 / 15);
    max-width: 680px;
    min-height: calc(100vh - 56px + 30px - 200px);
    margin: 0 auto;
    margin-top: -30px;

    @media (min-width: 700px) {
      min-height: calc(100vh - 75px + 30px - 200px);
    }
  `;

  return (
    <>
    <Header title="Artist notes" />
    <Items>
    {
      artists.map(artist => <ArtistItem artist={artist} key={artist.name}/>)
    }
    </Items>
    <Footer />
    </>
  );
}

export default TopPage;

interface ArtistItemProps {
  artist: Artist,
}

const ArtistItem: FC<ArtistItemProps> = ({artist}) => {

  const Container = styled.div`
    width: calc(100% * 6 / 13);
    max-width: 240px;
    margin-top: 70px;

    @media (min-width: 700px) {
      margin-top: 100px;
    }
  `;

  const StyledSumbnail = styled(Sumbnail)`
    width: 100%;
  `;

  const Name = styled.p`
    width: 100%;
    height: 20px;
    margin: 0;
    margin-top: 8px;
    text-align: right;
    line-height: 20px;
    font-family: NotoSansCJKjp-Regular;
    font-size: 14px;
    color: #545454;

    @media (min-width: 700px) {
      height: 27px;
      margin-top: 12px;
      font-size: 18px;
    }
  `;

  const Comment = styled.p`
    width: 100%;
    height: 17px;
    margin: 0;
    margin-top: 2px;
    text-align: right;
    line-height: 17px;
    font-family: NotoSansCJKjp-Regular;
    font-size: 11px;
    color: #A5A5A5;

    @media (min-width: 700px) {
      height: 20px;
      margin-top: 0px;
      font-size: 14px;
    }
  `;

  return (
    <Container>
      <Link to={"/artist/" + artist.id}>
        <StyledSumbnail src={artist.image_url} />
      </Link>
      <Name>{artist.name}</Name>
      <Comment>{artist.comment}</Comment>
    </Container>
  );

}
