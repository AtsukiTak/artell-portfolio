import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import Header from '../components/header';
import Footer from '../components/footer';
import Artist from '../models/artist';

const TopPage = () => {
  const [artists, setArtists] = useState<Array<Artist>>([]);

  useEffect(() => {
    setArtists([artistAtsuki, artistYuzuka]);
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

const ArtistItem = (props: ArtistItemProps) => {
  const artist = props.artist;
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useCallback(node=> {
    if (node !== null) {
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const Container = styled.div`
    width: calc(100% * 6 / 13);
    max-width: 240px;
    margin-top: 70px;

    @media (min-width: 700px) {
      margin-top: 100px;
    }
  `;

  const Sumbnail = styled("div")<{height: number, src: string}>`
    display: inline-block;
    width: 100%;
    height: ${props => props.height}px;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.5);
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
    <Container ref={containerRef}>
      <Sumbnail
        src={artist.image_url}
        height={containerWidth}>
      </Sumbnail>
      <Name>{artist.name}</Name>
      <Comment>{artist.comment}</Comment>
    </Container>
  );

}

const artistAtsuki = {
  name: "Atsuki Takahashi",
  comment: "私を表現するのは色",
  image_url: "https://firebasestorage.googleapis.com/v0/b/artell-gallery.appspot.com/o/artists%2Fartist1.png?alt=media&token=10ccc042-974a-4379-8e45-3caec7ab9720",
};
const artistYuzuka = {
  name: "Yuzuka Nakata",
  comment: "12人の友達",
  image_url: "https://firebasestorage.googleapis.com/v0/b/artell-gallery.appspot.com/o/artists%2Fartist2.png?alt=media&token=64247e52-acac-4c94-abb6-cedd1ef2643f",
};
