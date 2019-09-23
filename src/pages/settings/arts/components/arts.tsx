import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Art } from "models/art";
import { pc } from "components/responsive";
import Sumbnail from "components/sumbnail";

interface Props {
  arts: Art[];
}

const ArtsComponent: FC<Props> = ({ arts }) => {
  return (
    <Container>
      <ArtContainer key="new">
        <Link to={`/settings/arts/add`}>
          <Sumbnail src="/img/add-art-thumbnail.png" />
        </Link>
        <ArtTitle>作品を追加する</ArtTitle>
      </ArtContainer>
      {arts.map(art => (
        <ArtContainer key={art.id}>
          <Link to={`/settings/arts/edit/${art.id}`}>
            <Sumbnail src={art.thumbnail.getUrl()} />
          </Link>
          <ArtTitle>{art.attrs.title}</ArtTitle>
        </ArtContainer>
      ))}
    </Container>
  );
};

export default ArtsComponent;

const Container = styled.div`
  width: 100%;
  padding-bottom: 50px;

  ${pc(`
    justify-content: start;
    padding-top: 50px;
  `)}
`;

const ArtContainer = styled.div`
  display: block;
  width: 50vw;
  margin: 50px auto 0 auto;

  ${pc(`
    width: 280px;
    margin: 25px 70px;
  `)}
`;

const ArtTitle = styled.h4`
  margin: 0;
  margin-top: 5px;
  color: gray;
`;
