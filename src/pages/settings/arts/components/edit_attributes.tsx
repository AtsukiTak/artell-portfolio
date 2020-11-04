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
        <AttributeName>作品タイトル / Title</AttributeName>
        <InputField
          type="text"
          value={attrs.title}
          placeholder="作品のタイトルを入力してください。"
          onChange={(e) => setAttrs({ ...attrs, title: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>幅 / Width(mm)</AttributeName>
        <InputField
          type="tel"
          value={attrs.widthMM || ""}
          placeholder="mm(ミリ)単位で入力してください。"
          onChange={(e) =>
            setAttrs({ ...attrs, widthMM: validateNum(e.target.value) })
          }
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>高さ / Height(mm)</AttributeName>
        <InputField
          type="tel"
          value={attrs.heightMM || ""}
          placeholder="mm(ミリ)単位で入力してください。"
          onChange={(e) =>
            setAttrs({ ...attrs, heightMM: validateNum(e.target.value) })
          }
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>ステートメント / Statement</AttributeName>
        <TextField
          value={attrs.description}
          placeholder="制作の中で考えたことや制作動機を記入ください"
          onChange={(e) => setAttrs({ ...attrs, description: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>素材 / Materials</AttributeName>
        <InputField
          type="text"
          placeholder="Oil on canvas"
          value={attrs.materials}
          onChange={(e) => setAttrs({ ...attrs, materials: e.target.value })}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>作品を販売する/Sale this piece</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.salesPriceYen !== undefined}
          onChange={(e) =>
            setAttrs({
              ...attrs,
              salesPriceYen: e.target.checked ? 29800 : undefined,
            })
          }
        />
        <Desc>作品を販売しない場合は、チェックを外してください。</Desc>
      </EditAttributeElement>
      {attrs.salesPriceYen !== undefined ? (
        <SubEditAttributeElement>
          <AttributeName>販売価格(円) / Price to sell(JPY)</AttributeName>
          <InputField
            type="tel"
            value={attrs.salesPriceYen}
            onChange={(e) =>
              setAttrs({ ...attrs, salesPriceYen: validateNum(e.target.value) })
            }
          />
        </SubEditAttributeElement>
      ) : null}
      <EditAttributeElement>
        <AttributeName>作品の展示可否 / Exhibition Availability</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.rentalPriceYen !== undefined}
          onChange={(e) =>
            setAttrs({
              ...attrs,
              rentalPriceYen: e.target.checked ? 4900 : undefined,
            })
          }
        />
        <Desc>作品の展示依頼を拒否する場合は、チェックを外してください。</Desc>
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>公開設定 / Publishing Settings</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={attrs.showPublic}
          onChange={(e) => setAttrs({ ...attrs, showPublic: e.target.checked })}
        />
        <Desc>
          {attrs.showPublic
            ? "チェックを外すと作品を登録しても、作品は公開されません。"
            : "チェックをすると作品を登録したとき、作品が公開されます。"}
        </Desc>
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
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333333;
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
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #acacac;
  font-size: 16px;
  line-height: 20px;
  color: #acacac;
  &::placeholder {
    font-size: 12px;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
      sans-serif;
  }
`;

const TextField = styled.textarea`
  width: 100%;
  height: 164px;
  margin-right: 5px;
  padding: 6px 8px;
  background-color: #fff;
  border: 1px solid #acacac;
  border-radius: 3px;
  font-size: 16px;
  line-height: 20px;
  &::placeholder {
    font-size: 12px;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
      sans-serif;
  }
`;

export default EditAttributesComponent;
