import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { buyArt } from "models/artist";
import { RootState } from "services/index";
import { getArtistByName } from "services/artist";
import { pc } from "components/responsive";

interface ArtPageProps {
  artistName: string;
  artId: string;
}

const ArtPage: FC<ArtPageProps> = ({ artistName, artId }) => {
  const [buying, setBuying] = useState(false);

  const artistAndArts = useSelector((state: RootState) =>
    state.artist.list.find(({ artist }) => artist.attrs.name === artistName)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!artistAndArts) {
      dispatch(getArtistByName(artistName));
    }
  }, [artistName, artistAndArts, dispatch]);

  const artist = artistAndArts ? artistAndArts.artist : undefined;
  const art = artistAndArts
    ? artistAndArts.arts.find(art => art.id === artId)
    : undefined;

  return (
    <>
      <CloseButton to={`/${artistName}/`} />
      {art && artist ? (
        <>
          <ArtContainer src={art.thumbnail.getUrl()} />
          <CaptionContainer>
            <ArtistName>{artist.attrs.name}</ArtistName>
            <Info>{art.attrs.title}</Info>
            <Info>{art.attrs.materials}</Info>
            <Info>{`${art.attrs.widthMM} x ${art.attrs.heightMM} mm`}</Info>
            {art.attrs.salesPriceYen ? (
              buying ? (
                <BuyButton>Loading...</BuyButton>
              ) : (
                <BuyButton
                  onClick={() => {
                    setBuying(true);
                    buyArt(artist.uid, art.id);
                  }}
                >
                  購入する &nbsp; / &nbsp; &yen;{" "}
                  {toPriceDisplay(art.attrs.salesPriceYen)}
                </BuyButton>
              )
            ) : null}
          </CaptionContainer>
        </>
      ) : null}
    </>
  );
};

export default ArtPage;

function toPriceDisplay(priceYen: number): string {
  return priceYen.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
    content: " ";
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

const ArtContainer = styled("div")<{ src: string }>`
  width: 90vw;
  height: 80vh;
  margin: 0 auto;
  background-image: url(${({ src }) => src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  ${pc(`
    display: inline-block;
    width: calc(100vw - 385px);
    height: 94vh;
    margin: 0;
    margin-top: 3vh;
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

const BuyButton = styled.button`
  display: block;
  width: 100%;
  height: 40px;
  margin: 0 auto;
  margin-top: 35px;
  border-radius: 4px;
  border: 1px solid #a1a1a1;
  background-color: white;
  font-family: NotoSansCJKjp-Light;
  font-size: 12px;
  color: #a1a1a1;
  text-align: center;
  line-height: 20px;
  cursor: pointer;

  ${pc(`
    display: inline-block;
    margin: 0;
    margin-top: 35px;
  `)}
`;
