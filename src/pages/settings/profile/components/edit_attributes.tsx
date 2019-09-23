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
        <AttributeName>Name</AttributeName>
        <InputField
          type="text"
          value={attrs.name}
          onChange={e => setAttrs({ ...attrs, name: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Comment</AttributeName>
        <InputField
          type="text"
          value={attrs.comment}
          onChange={e => setAttrs({ ...attrs, comment: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Description</AttributeName>
        <TextField
          value={attrs.description}
          onChange={e => setAttrs({ ...attrs, description: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Twitter</AttributeName>
        <InputField
          type="text"
          value={"@" + attrs.twitter}
          onChange={e =>
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
          onChange={e => setAttrs({ ...attrs, facebook: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Instagram</AttributeName>
        <InputField
          type="text"
          placeholder="artell.gallery"
          value={attrs.instagram}
          onChange={e => setAttrs({ ...attrs, instagram: e.target.value })}
        />
      </EditAttributeElement>
    </Container>
  );
};

export default EditAttributesComponent;

const Container = styled.div`
  width: 100%;
  padding: 30px 0;
`;

const EditAttributeElement = styled.div`
  width: 100%;
  margin-top: 25px;

  &:first-of-type {
    margin-top: 0px;
  }
`;

const AttributeName = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 100%;
  height: 34px;
  margin-right: 5px;
  padding: 6px 8px;
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
  font-size: 14px;
  line-height: 20px;
`;

const TextField = styled.textarea`
  width: 100%;
  height: 74px;
  margin-right: 5px;
  padding: 6px 8px;
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
  font-size: 14px;
  line-height: 20px;
`;
