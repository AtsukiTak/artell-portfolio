import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";

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
        <Link href={`/settings/arts/add`}>
          <a>
            <AddArtButton>作品を追加する</AddArtButton>
          </a>
        </Link>
      </ArtContainer>
      {arts.map((art) => (
        <ArtContainer key={art.id}>
          <Link href={`/settings/arts/edit/${art.id}`}>
            <a>
              <Sumbnail image={art.thumbnail} />
            </a>
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
`;

const AddArtButton = styled.button`
  display: block;
  width: 100%;
  height: 51px;
  margin: 30px auto 0 auto;
  background: white;
  border-radius: 2px;
  border: solid 1px #333;
  font-size: 13px;
  letter-spacing: 1.18px;
  color: #333333;
  font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
    sans-serif;
  ${pc(`
    font-size: 14px;
  `)}
`;
