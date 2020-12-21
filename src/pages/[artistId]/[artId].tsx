import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";

// material ui
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

// internal modules
import { Artist } from "models/artist";
import { Art } from "models/art";
import { useScrollToTop } from "utils/scrollToTop";
import { downloadImage } from "utils/image";
import { pc } from "components/Responsive";
import * as color from "components/color";

// SSR
import { GetServerSideProps } from "next";
import { getFirebaseApp } from "infras/firebase";
import { queryArtistById } from "infras/repos/artist";
import { queryPublicArtsOfArtist } from "infras/repos/art";

interface PageProps {
  artist: Artist;
  art: Art;
}

const ArtPage: FC<PageProps> = ({ artist, art }) => {
  useScrollToTop();

  const [buying, setBuying] = useState(false);

  // TODO
  // useImageDownload hooksをつくる
  const [downloadedThumbnail, setDownloadedThumbnail] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    downloadImage(art.thumbnailUrl).then(setDownloadedThumbnail);
  }, [art.thumbnailUrl]);

  if (downloadedThumbnail === null) {
    // Loading page
    return (
      <ProgressContainer>
        <CircularProgress size={50} thickness={2} />
      </ProgressContainer>
    );
  }

  // 作品ページ
  return (
    <Grid container alignItems="flex-end">
      <Hidden only={["lg", "xl"]}>
        <Link href={`/${artist.uid}/`} passHref>
          <MobileCloseButton>{artist.name}｜作品一覧を見る →</MobileCloseButton>
        </Link>
      </Hidden>
      <Hidden only={["xs", "sm", "md"]}>
        <Link href={`/${artist.uid}`} passHref>
          <PcCloseButton>{artist.name}｜作品一覧を見る →</PcCloseButton>
        </Link>
      </Hidden>
      <Grid item xs={12} md={9}>
        <Fade in timeout={2000}>
          <ArtContainer src={downloadedThumbnail} />
        </Fade>
      </Grid>
      <Grid item xs={12} md={3}>
        <CaptionContainer>
          <Title>{art.title}</Title>
          <ArtistName>{artist.name}</ArtistName>
          <Materials>{art.materials}</Materials>
          <Size>{`${art.widthMM} x ${art.heightMM} mm`}</Size>
          <Description>{art.description}</Description>
          {art.salesPriceYen ? (
            buying ? (
              <BuyButton>Loading...</BuyButton>
            ) : (
              <BuyButton
                onClick={() => {
                  setBuying(true);
                  buyArt(artist.uid, art.id);
                }}
              >
                Buy &nbsp; / &nbsp; &yen; {toPriceDisplay(art.salesPriceYen)}
              </BuyButton>
            )
          ) : null}
        </CaptionContainer>
      </Grid>
    </Grid>
  );
};

export default ArtPage;

function toPriceDisplay(priceYen: number): string {
  return priceYen.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
 * =================
 * getServerSideProps
 * =================
 */
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const artistId = context.params!.artistId as string;
  const artId = context.params!.artId as string;

  // TODO
  // getFirebaseAppをinfra層の内部でやる
  const fbApp = getFirebaseApp();

  // artistの取得
  const artist = await queryArtistById(artistId, fbApp);
  if (artist === null) {
    return {
      notFound: true,
    };
  }

  // artの取得
  const arts = await queryPublicArtsOfArtist(artistId, fbApp);
  const art = arts.find((art) => art.id === artId);
  if (art === undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      artist,
      art,
    },
  };
};

/*
 * =================
 * StyledComponents
 * =================
 */
const PcCloseButton = styled.a`
  position: absolute;
  right: 20px;
  bottom: 12px;
  font-size: 12px;
  text-decoration: none;
  color: ${color.LightGray.hex};
`;

const MobileCloseButton = styled.a`
  position: absolute;
  right: 24px;
  top: 24px;
  font-size: 12px;
  text-decoration: none;
  color: ${color.LightGray.hex};
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

const ArtProgressContainer = styled.div`
  width: 90%;
  height: 150vw;
  margin: 20px auto;

  ${pc(`
    height: 94vh;
    margin: 0;
    margin-top: 3vh;
    padding-left: calc(45% - 25px);
    padding-top: 40vh;
  `)}
`;

const CaptionContainer = styled.div`
  min-height: 20vh;
  padding: 25px 40px;
  text-align: left;
  ${pc(`
    padding: 0px;

    width: 225px;
    margin-bottom: 100px;
  `)}
`;

const Title = styled.div`
  padding-right: 24px;
  margin-bottom: 32px;
  font-size: 20px;
  color: ${color.LightBlack.hex};
  line-height: 20px;
  letter-spacing: 2px;
`;

const ArtistName = styled.div`
  padding-right: 24px;
  margin-bottom: 4px;
  font-size: 12px;
  color: ${color.LightGray.hex};
  line-height: 12px;
  letter-spacing: 2px;
`;

const Materials = styled.div`
  padding-right: 24px;
  margin-bottom: 4px;
  font-size: 12px;
  color: ${color.LightGray.hex};
  margin-top: 8px;
  line-height: 12px;
`;

const Size = styled.div`
  padding-right: 24px;
  margin-bottom: 16px;
  font-size: 12px;
  color: ${color.LightGray.hex};
  margin-top: 8px;
  line-height: 12px;
  letter-spacing: 0.5px;
`;

const Description = styled.div`
  padding-right: 40px;
  font-size: 12px;
  color: ${color.LightGray.hex};
  margin-top: 8px;
  line-height: 16px;
  letter-spacing: 0.8px;
`;

const BuyButton = styled.button`
  display: block;
  width: 100%;
  height: 42px;
  margin: 0 auto;
  margin-top: 40px;
  border-radius: 2px;
  border: 1px solid ${color.MidGray.hex};
  background-color: white;
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
