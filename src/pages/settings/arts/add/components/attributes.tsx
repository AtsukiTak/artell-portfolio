import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';

import {StoredArt} from 'models/artist';

interface Props {
  fbUser: firebase.User;
  onAttributeChange: (attrs: StoredArt | null) => void;
}

const EditAttributesComponent: FC<Props> = ({fbUser, onAttributeChange}) => {
  const [title, setTitle] = useState('');
  const [widthMM, setWidthMM] = useState<number>(0);
  const [heightMM, setHeightMM] = useState<number>(0);
  const [desc, setDesc] = useState('');
  const [materials, setMaterials] = useState('');
  const [priceYen, setPriceYen] = useState<number>(0);

  useEffect(() => {
    if (title === '') {
      onAttributeChange(null);
    } else {
      onAttributeChange({
        title: title,
        widthMM: widthMM,
        heightMM: heightMM,
        description: desc,
        materials: materials,
        priceYen: priceYen,
      });
    }
  }, [title, widthMM, heightMM, desc, materials, priceYen, onAttributeChange]);

  return (
    <Container>
      <EditAttributeElement>
        <AttributeName>Title</AttributeName>
        <InputField
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Width (mm)</AttributeName>
        <InputField
          type="tel"
          value={widthMM || ''}
          onChange={e => setWidthMM(validateNum(e.target.value))}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Height (mm)</AttributeName>
        <InputField
          type="tel"
          value={heightMM || ''}
          onChange={e => setHeightMM(validateNum(e.target.value))}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Description</AttributeName>
        <TextField value={desc} onChange={e => setDesc(e.target.value)} />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>素材</AttributeName>
        <InputField
          type="text"
          placeholder="Acrylic, transfers, colored pencil, charcoal, and pastel on paper"
          value={materials}
          onChange={e => setMaterials(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Price (Yen)</AttributeName>
        <InputField
          type="tel"
          value={priceYen || ''}
          onChange={e => setPriceYen(validateNum(e.target.value))}
        />
      </EditAttributeElement>
    </Container>
  );
};

function validateNum(s: string): number {
  const n = Number(s);
  if (Number.isNaN(n)) {
    alert('数字を入力してください');
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
