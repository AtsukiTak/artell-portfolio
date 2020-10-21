import React from "react";
import styled from "styled-components";

import { ArtistAttributes } from "models/artist";

interface Props {
  attrs: ArtistAttributes;
  setAttrs: (attrs: ArtistAttributes) => void;
}

const EditAttributesComponent: React.FC<Props> = ({ attrs, setAttrs }) => {
  return (
    <Container>
      <EditAttributeElement>
        <AttributeName>名前 / Name</AttributeName>
        <InputField
          type="text"
          value={attrs.name}
          onChange={(e) => setAttrs({ ...attrs, name: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>ヒトコト / Status Message</AttributeName>
        <InputField
          type="text"
          value={attrs.comment}
          onChange={(e) => setAttrs({ ...attrs, comment: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>プロフィール / Profile</AttributeName>
        <TextField
          value={attrs.description}
          onChange={(e) => setAttrs({ ...attrs, description: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Twitter</AttributeName>
        <InputField
          type="text"
          value={"@" + attrs.twitter}
          onChange={(e) =>
            setAttrs({ ...attrs, twitter: e.target.value.slice(1) })
          }
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Facebook</AttributeName>
        <InputField
          type="text"
          placeholder="artell.life.42"
          value={attrs.facebook}
          onChange={(e) => setAttrs({ ...attrs, facebook: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Instagram</AttributeName>
        <InputField
          type="text"
          placeholder="artell.gallery"
          value={attrs.instagram}
          onChange={(e) => setAttrs({ ...attrs, instagram: e.target.value })}
        />
      </EditAttributeElement>
    </Container>
  );
};

export default EditAttributesComponent;

const Container = styled.div`
  width: 100%;
  padding: 30px 0;
  font-family: YuGo, sans-serif;
`;

const EditAttributeElement = styled.div`
  width: 100%;
  margin-top: 25px;

  &:first-of-type {
    margin-top: 0px;
  }
`;

const AttributeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333333;
`;

const InputField = styled.input`
  width: 100%;
  height: 34px;
  margin-right: 5px;
  padding: 6px 8px;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #acacac;
  font-size: 16px;
  line-height: 20px;
  color: #acacac;
`;

const TextField = styled.textarea`
  width: 100%;
  height: 162px;
  margin-right: 5px;
  padding: 6px 8px;
  background-color: white;
  border: 1px solid #acacac;
  border-radius: 2px;
  font-size: 16px;
  line-height: 28px;
  color: #acacac;
`;
