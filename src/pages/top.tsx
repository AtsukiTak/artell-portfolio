import React, {FC, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {RootState} from 'services/index';
import {getArtistList} from 'services/artist';
import {Artist} from 'models/artist';
import Header from 'components/header';
import Footer from 'components/footer';
import Sumbnail from 'components/sumbnail';

const TopPage = () => {
  const artists = useSelector((state: RootState) => state.artist.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getArtistList());
  }, [dispatch]);

  const Items = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 70%;
    max-width: 990px;
    min-height: calc(100vh - 56px + 30px - 200px);
    margin: 0 auto;
    margin-top: -30px;

    @media (min-width: 700px) {
      min-height: calc(100vh - 75px + 30px - 200px);
    }
  `;

  return (
    <>
      <Header title="Artists" />
      <Items>
        {artists.map(({artist, arts}) => (
          <ArtistItem artist={artist} key={artist.attrs.name} />
        ))}
      </Items>
      <Footer />
    </>
  );
};

export default TopPage;

interface ArtistItemProps {
  artist: Artist;
}

const ArtistItem: FC<ArtistItemProps> = ({artist}) => {
  const Container = styled.div`
    width: 300px;
    max-width: 100%;
    margin: 0 15px;
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
    color: #a5a5a5;

    @media (min-width: 700px) {
      height: 20px;
      margin-top: 0px;
      font-size: 14px;
    }
  `;

  return (
    <Container>
      <Link to={'/' + artist.attrs.name + '/'}>
        <StyledSumbnail
          src={
            artist.thumbnail
              ? artist.thumbnail.getUrl()
              : 'img/artist-default-thumbnail.jpg'
          }
        />
      </Link>
      <Name>{artist.attrs.name}</Name>
      <Comment>{artist.attrs.comment}</Comment>
    </Container>
  );
};
