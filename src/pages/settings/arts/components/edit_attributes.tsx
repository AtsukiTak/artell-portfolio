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
        <AttributeName>公開設定</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.showPublic}
          onChange={e => setAttrs({ ...attrs, showPublic: e.target.checked })}
        />
        <Desc>
          {attrs.showPublic
            ? "チェックを外すと「追加」ボタンを押しても作品は公開されません。"
            : "チェックをすると「追加」ボタンを押したとき作品が公開されます。"}
        </Desc>
      </EditAttributeElement>
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
          placeholder="制作の中で考えたことや制作動機を記入ください"
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
        <AttributeName>作品を販売する</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.salesPriceYen !== undefined}
          onChange={e =>
            setAttrs({
              ...attrs,
              salesPriceYen: e.target.checked ? 29800 : undefined
            })
          }
        />
        <Desc>作品を販売する場合はチェックしてください。</Desc>
      </EditAttributeElement>
      {attrs.salesPriceYen !== undefined ? (
        <SubEditAttributeElement>
          <AttributeName>販売価格 (Yen)</AttributeName>
          <InputField
            type="tel"
            value={attrs.salesPriceYen}
            onChange={e =>
              setAttrs({ ...attrs, salesPriceYen: validateNum(e.target.value) })
            }
          />
        </SubEditAttributeElement>
      ) : null}
      <EditAttributeElement>
        <AttributeName>作品のレンタルを可能にする</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.rentalPriceYen !== undefined}
          onChange={e =>
            setAttrs({
              ...attrs,
              rentalPriceYen: e.target.checked ? 4900 : undefined
            })
          }
        />
        <Desc>作品のレンタルを可能にする場合はチェックしてください。</Desc>
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
  margin-top: 35px;

  &:first-of-type {
    margin-top: 0px;
  }
`;

const SubEditAttributeElement = styled.div`
  width: 100%;
  margin-top: 15px;
  padding-left: 25px;
`;

const AttributeName = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const InputCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin: 5px 0 0 0;
`;

const Desc = styled.p`
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 20px - 20px);
  margin: 5px 0 0 20px;
  font-size: 11px;
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
