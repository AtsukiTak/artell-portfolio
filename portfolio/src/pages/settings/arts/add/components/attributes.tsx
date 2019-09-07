import React from "react";
import styled from "styled-components";

import { ArtAttributes } from "models/art";

interface Props {
  attrs: ArtAttributes;
  setAttrs: (attrs: ArtAttributes) => void;
}

const EditAttributesComponent: React.FC<Props> = ({ attrs, setAttrs }) => {
  return (
    <Container>
      <EditAttributeElement>
        <AttributeName>Title</AttributeName>
        <InputField
          type="text"
          value={attrs.title}
          onChange={e => setAttrs({ ...attrs, title: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Width (mm)</AttributeName>
        <InputField
          type="tel"
          value={attrs.widthMM || ""}
          onChange={e =>
            setAttrs({ ...attrs, widthMM: validateNum(e.target.value) })
          }
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Height (mm)</AttributeName>
        <InputField
          type="tel"
          value={attrs.heightMM || ""}
          onChange={e =>
            setAttrs({ ...attrs, heightMM: validateNum(e.target.value) })
          }
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
        <AttributeName>素材</AttributeName>
        <InputField
          type="text"
          placeholder="Acrylic, transfers, colored pencil, charcoal, and pastel on paper"
          value={attrs.materials}
          onChange={e => setAttrs({ ...attrs, materials: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Price (Yen)</AttributeName>
        <InputField
          type="tel"
          value={attrs.priceYen || ""}
          onChange={e =>
            setAttrs({ ...attrs, priceYen: validateNum(e.target.value) })
          }
        />
      </EditAttributeElement>
    </Container>
  );
};

function validateNum(s: string): number {
  const n = Number(s);
  if (Number.isNaN(n)) {
    alert("数字を入力してください");
    return 0;
  } else {
    return n;
  }
}

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

export default EditAttributesComponent;
