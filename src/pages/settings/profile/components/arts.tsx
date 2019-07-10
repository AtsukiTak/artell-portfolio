import React, {FC} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {onPc} from 'components/responsive';
import Sumbnail from 'components/sumbnail';
import {SquareBasedWidth} from 'components/square';
import {Art} from 'models/artist';

interface Props {
  arts: Art[];
}

const ArtsComponent: FC<Props> = ({arts}) => {
  return (
    <Container>
      {arts.map(art => (
        <ArtContainer key={art.id}>
          <Link to={`/settings/edit_art/${art.id}`}>
            <Sumbnail src={art.sumbnailUrl} />
          </Link>
          <ArtTitle>{art.title}</ArtTitle>
        </ArtContainer>
      ))}
      <ArtContainer key="new">
        <Link to={`/settings/add_art`}>
          <AddArtSumbnail />
        </Link>
        <ArtTitle>アートを追加する</ArtTitle>
      </ArtContainer>
    </Container>
  );
};

export default ArtsComponent;

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 50px 0;
  justify-content: center;
  flex-wrap: wrap;

  ${onPc(`
    justify-content: start;
  `)}
`;

const ArtContainer = styled.div`
  display: block;
  width: 50vw;
  margin-top: 50px;

  &:first-of-type {
    margin-left: 0px;
  }

  ${onPc(`
    width: 280px;
    margin-left: 70px;
  `)}
`;

const ArtTitle = styled.h4`
  margin: 0;
  margin-top: 5px;
  color: gray;
`;

const AddArtSumbnail = styled(SquareBasedWidth)`
  width: 50vw;
  background-color: lightgray;

  ${onPc(`
    width: 280px;
  `)}
`;
