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
          <logo.Facebook />
          <logo.Twitter />
          <logo.Instagram />
        </Sns>
        <Description>{artist.description}</Description>
      </TextContent>
      <HR />
    </Container>
  );
};

export default ProfileComponent;

const Container = styled.div`
  width: 100%;
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
    width: 266px;
    margin-top: 0;
    padding-left: 110px;
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

  & > svg {
    width: 18px;
    height: 18px;
    margin-left: 15px;
  }
`;

const Description = styled.div`
  width: 100%;
  margin-top: 25px;
  font-family: NotoSansCJKjp-Regular;
  color: #505050;
  font-size: 16px;
  line-height: 32px;

  ${pc(`
    font-size: 14px;
    line-height: 28px;
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
