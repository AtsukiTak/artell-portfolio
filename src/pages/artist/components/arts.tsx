import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

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
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (min-width: 450px) {
    justify-content: space-between;
  }
`;

const ArtComponent = styled.div`
  width: 180px;
  margin-top: 80px;
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
