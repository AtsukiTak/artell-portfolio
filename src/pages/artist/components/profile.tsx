import React, {FC} from 'react';
import styled from 'styled-components';

import Sumbnail from 'components/sumbnail';
import * as logo from 'components/logo';
import {pc} from 'components/responsive';
import {Artist} from 'models/artist';

const ProfileComponent: FC<{artist: Artist}> = ({artist}) => {
  return (
    <Container>
      <StyledSumbnail src={artist.sumbnailUrl} />
      <TextContent>
        <Name>{artist.name}</Name>
        <Sns>
          {artist.facebook !== '' ? (
            <SnsLink
              href={`https://www.facebook.com/${artist.facebook}`}
              target="_blank">
              <logo.Facebook />
            </SnsLink>
          ) : null}
          {artist.twitter !== '' ? (
            <SnsLink
              href={`https://twitter.com/${artist.twitter}`}
              target="_blank">
              <logo.Twitter />
            </SnsLink>
          ) : null}
          {artist.instagram !== '' ? (
            <SnsLink
              href={`https://www.instagram.com/${artist.instagram}/`}
              target="_blank">
              <logo.Instagram />
            </SnsLink>
          ) : null}
        </Sns>
        <Description>{artist.description}</Description>
      </TextContent>
    </Container>
  );
};

export default ProfileComponent;

const Container = styled.div`
  width: 100%;

  ${pc(`
    width: 800px;
    margin: 0 auto;
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
