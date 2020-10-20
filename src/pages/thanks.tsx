import React from "react";
import styled from "styled-components";

const ThanksPage: React.FC = () => (
  <Title>ご購入ありがとうございました！</Title>
);

export default ThanksPage;

const Title = styled.h2`
  width: 100%;
  margin-top: 40vh;
  font-size: 20px;
  font-weight: normal;
  text-align: center;
`;
