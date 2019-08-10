import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {pc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';
import {Art, Artist} from 'models/artist';

const ArtsComponent: FC<{artist: Artist; arts: Art[]}> = ({artist, arts}) => {
  return (
    <Container>
      {arts.map(art => (
        <ArtComponent key={art.title}>
          <Link to={`/${artist.name}/${art.title}/`}>
            <StyledSumbnail src={art.sumbnailUrl} />
          </Link>
          <Title>{art.title}</Title>
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
    margin-right: 50px;

    &:nth-of-type(3n) {
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
