import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import { Artist, buyArt } from "models/artist";
import { RootState } from "services/index";
import { getArtistByName } from "services/artist";
import { pc } from "components/responsive";

import * as color from "components/color";

interface ArtPageProps {
  artistUrlName: string;
  artId: string;
}

const ArtPage: FC<ArtPageProps> = ({ artistUrlName, artId }) => {
  const artistName = Artist.decodeArtistUrlName(artistUrlName);

  const [buying, setBuying] = useState(false);

  const artistArts = useSelector((state: RootState) =>
    state.artist.map.get(artistName)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (artistArts === undefined) {
      dispatch(getArtistByName(artistName));
    }
  }, [artistName, artistArts, dispatch]);

  if (artistArts === undefined) {
    // Loading page
    return (
      <ProgressContainer>
        <CircularProgress size={50} thickness={2} />
      </ProgressContainer>
    );
  } else if (artistArts === null) {
    return (
      <NotFoundMessage variant="body2" align="center" color="textSecondary">
        `作家「${artistName}」さんが見つかりませんでした。`
      </NotFoundMessage>
    );
  } else {
    const artist = artistArts.artist;
    const art = artistArts.arts.find(art => art.id === artId);
    if (!art) {
      return (
        <NotFoundMessage variant="body2" align="center" color="textSecondary">
          指定の作品は存在しません。
        </NotFoundMessage>
      );
    } else {
      // 作品ページ
      return (
        <Fade in timeout={2000}>
          <Grid container alignItems="flex-end">
            <Hidden only={["lg", "xl"]}>
              <MobileCloseButton to={`/${artistUrlName}/`} />
            </Hidden>
            <Hidden only={["xs", "sm", "md"]}>
              <PcCloseButton to={`/${artistUrlName}/`} />
            </Hidden>
            <Grid item xs={12} md={9}>
              <ArtContainer src={art.thumbnail.getUrl()} />
            </Grid>
            <Grid item xs={12} md={3}>
              <CaptionContainer>
                <Title>{art.attrs.title}</Title>
                <ArtistName>{artist.attrs.name}</ArtistName>
                <Materials>{art.attrs.materials}</Materials>
                <Size>{`${art.attrs.widthMM} x ${art.attrs.heightMM} mm`}</Size>
                <Description>{art.attrs.description}</Description>
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
                      Buy &nbsp; / &nbsp; &yen;{" "}
                      {toPriceDisplay(art.attrs.salesPriceYen)}
                    </BuyButton>
                  )
                ) : null}
              </CaptionContainer>
            </Grid>
          </Grid>
        </Fade>
      );
    }
  }
};

export default ArtPage;

function toPriceDisplay(priceYen: number): string {
  return priceYen.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CloseButton = styled(Link)`
  position: absolute;
  width: 40px;
  height: 40px;

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

const PcCloseButton = styled(CloseButton)`
  right: 60px;
  top: calc(100vh - 40px - 40px);
`;

const MobileCloseButton = styled(CloseButton)`
  right: 24px;
  top: 24px;
`;

const ArtContainer = styled("div")<{ src: string }>`
  width: 90%;
  height: 150vw;
  margin: 20px auto;
  background-image: url(${({ src }) => src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  ${pc(`
    height: 94vh;
    margin: 0;
    margin-top: 3vh;
  `)}
`;

const CaptionContainer = styled.div`
  min-height: 20vh;
  padding: 25px 40px;
  text-align: right;
  ${pc(`
    padding: 0px;

    width: 225px;
    margin-bottom: 100px;
    text-align: left;
  `)}
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 20px;
  color: ${color.MidGray.hex};
  font-family: NotoSansCJKjp-Light;
  line-height: 20px;
  letter-spacing: 2px;
`;

const ArtistName = styled.div`
  margin-bottom: 4px;
  font-family: NotoSansCJKjp-Light;
  font-size: 12px;
  color: #a1a1a1;
  line-height: 12px;
  letter-spacing: 2px;
`;

const Materials = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  color: #a1a1a1;
  margin-top: 8px;
  font-family: NotoSansCJKjp-Light;
  line-height: 12px;
`;

const Size = styled.div`
  margin-bottom: 24px;
  font-size: 12px;
  color: #a1a1a1;
  margin-top: 8px;
  font-family: NotoSansCJKjp-Light;
  line-height: 12px;
  letter-spacing: 0.5px;
`;

const Description = styled.div`
  margin-bottom: 32px;
  font-size: 12px;
  color: #a1a1a1;
  margin-top: 8px;
  font-family: NotoSansCJKjp-Light;
  line-height: 12px;
  letter-spacing: 0.8px;
`;

const BuyButton = styled.button`
  display: block;
  width: 100%;
  height: 48px;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 4px;
  border: 1px solid ${color.MidGray.hex};
  background-color: white;
  font-family: NotoSansCJKjp-Light;
  font-size: 12px;
  letter-spacing: 1.57px;
  color: ${color.MidGray.hex};
  text-align: center;
  line-height: 20px;
  cursor: pointer;

  ${pc(`
    display: inline-block;
    margin: 0;
    margin-top: 35px;
  `)}
`;

const ProgressContainer = styled.div`
  width: 50px;
  margin: 40vh auto;
`;

const NotFoundMessage = styled(Typography)`
  margin-top: 40vh;
`;
