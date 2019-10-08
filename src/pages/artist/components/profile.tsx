import React, { FC } from "react";
import styled from "styled-components";

import { Artist } from "models/artist";

import Sumbnail from "components/sumbnail";
import * as logo from "components/logo";
import { pc } from "components/responsive";

const ProfileComponent: FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <Container>
      <StyledSumbnail
        src={
          artist.thumbnail
            ? artist.thumbnail.getUrl()
            : "/img/artist-default-thumbnail.jpg"
        }
      />
      <TextContent>
        <Name>{artist.attrs.name}</Name>
        <Sns>
          {artist.attrs.facebook !== "" ? (
            <SnsLink
              href={`https://www.facebook.com/${artist.attrs.facebook}`}
              target="_blank"
            >
              <logo.Facebook />
            </SnsLink>
          ) : null}
          {artist.attrs.twitter !== "" ? (
            <SnsLink
              href={`https://twitter.com/${artist.attrs.twitter}`}
              target="_blank"
            >
              <logo.Twitter />
            </SnsLink>
          ) : null}
          {artist.attrs.instagram !== "" ? (
            <SnsLink
              href={`https://www.instagram.com/${artist.attrs.instagram}/`}
              target="_blank"
            >
              <logo.Instagram />
            </SnsLink>
          ) : null}
        </Sns>
        <Description>{artist.attrs.description}</Description>
      </TextContent>
    </Container>
  );
};

export default ProfileComponent;

const Container = styled.div`
  width: 100%;
  margin-top: 50px;

  ${pc(`
    width: 800px;
    margin: 0 auto;
    margin-top: 90px;
  `)}
`;

const StyledSumbnail = styled(Sumbnail)`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  ${pc(`
    display: inline-block;
    width: 400px;
  `)}
`;

const TextContent = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 100%;
  margin-top: 18px;

  ${pc(`
    width: 290px;
    margin-top: 0;
    margin-left: 110px;
  `)}
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
`;

const SnsLink = styled.a`
  margin-left: 15px;

  & svg {
    width: 18px;
    height: 18px;
  }
`;

const Description = styled.div`
  width: 100%;
  margin-top: 25px;
  font-family: NotoSansCJKjp-Regular;
  color: #505050;
  font-size: 16px;
  line-height: 32px;
  word-break: break-all;

  ${pc(`
    font-size: 14px;
    line-height: 28px;
  `)}
`;
