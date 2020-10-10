import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Art } from "models/art";
import { DownloadImage } from "models/image";
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
          <AddArtButton>作品を追加する</AddArtButton>
        </Link>
      </ArtContainer>
      {arts.map(art => (
        <ArtContainer key={art.id}>
          <Link to={`/settings/arts/edit/${art.id}`}>
            <Sumbnail image={art.thumbnail} />
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
  font-family: YuGo, sans-serif;

  ${pc(`
    justify-content: start;
    padding-top: 50px;
  `)}
`;

const ArtContainer = styled.div`
  display: block;
  width: 80vw;
  margin: 50px auto 0 auto;

  & a {
    text-decoration: none;
  }

  ${pc(`
    margin: 50px auto;
  `)}
`;

const ArtTitle = styled.p`
  margin: 0;
  margin-top: 5px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;
  line-height: 2;
  color: #333333;
  font-family: YuGo, sans-serif;
`;


const AddArtButton = styled.button`
  display: block;
  width: 100%;
  height: 51px;
  margin: 30px auto 0 auto;
  background: white;
  border-radius: 2px;
  border: solid 1.5px #666666;
  font-size: 13px;
  letter-spacing: 1.18px;
  color: #333333;
  font-family: YuGo, sans-serif;
`;
