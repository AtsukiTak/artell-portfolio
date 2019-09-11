import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {Art, Artist} from 'artell-models';

import {pc, MinPcWidth} from 'components/responsive';
import Sumbnail from 'components/sumbnail';

const ArtsComponent: FC<{artist: Artist; arts: Art[]}> = ({artist, arts}) => {
  return (
    <Container>
      {arts.map(art => (
        <ArtComponent key={art.attrs.title}>
          <Link to={`/${artist.attrs.name}/${art.id}/`}>
            <StyledSumbnail src={art.thumbnail.getUrl()} />
          </Link>
          <Title>{art.attrs.title}</Title>
        </ArtComponent>
      ))}
    </Container>
  );
};

export default ArtsComponent;

const Container = styled.div`
  width: 100%;
`;

const ArtComponent = styled.div`
  width: 180px;
  margin: 0 auto;
  margin-top: 80px;

  ${pc(`
    display: inline-block;
    margin-right: calc((${MinPcWidth}px - (180px * 4)) / 3);

    &:nth-of-type(4n) {
      margin-right: 0px;
    }
  `)}
`;

const StyledSumbnail = styled(Sumbnail)`
  width: 100%;
`;

const Title = styled.div`
  width: 100%;
  font-family: NotoSansCJKjp-Bold;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0.44px;
  text-align: center;
  margin-top: 15px;
`;
