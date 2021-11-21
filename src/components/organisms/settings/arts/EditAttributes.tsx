import React from "react";
import styled from "styled-components";

import Spacer from "components/atoms/Spacer";
import { Art } from "models/art";

export type ArtAttrs = Omit<Art, "id" | "thumbnailUrl">;

interface Props {
  art: ArtAttrs;
  setArt: (art: ArtAttrs) => void;
}

const EditAttributes: React.FC<Props> = ({ art, setArt }) => {
  return (
    <div>
      <div>
        <AttributeName>作品タイトル / Title</AttributeName>
        <InputField
          type="text"
          value={art.title}
          placeholder="作品のタイトルを入力してください。"
          onChange={(e) => setArt({ ...art, title: e.target.value })}
        />
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>幅 / Width(mm)</AttributeName>
        <InputField
          type="tel"
          value={art.widthMM || ""}
          placeholder="mm(ミリ)単位で入力してください。"
          onChange={(e) =>
            setArt({ ...art, widthMM: validateNum(e.target.value) })
          }
        />
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>高さ / Height(mm)</AttributeName>
        <InputField
          type="tel"
          value={art.heightMM || ""}
          placeholder="mm(ミリ)単位で入力してください。"
          onChange={(e) =>
            setArt({ ...art, heightMM: validateNum(e.target.value) })
          }
        />
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>ステートメント / Statement</AttributeName>
        <TextField
          value={art.description}
          placeholder="制作の中で考えたことや制作動機を記入ください"
          onChange={(e) => setArt({ ...art, description: e.target.value })}
        />
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>素材 / Materials</AttributeName>
        <InputField
          type="text"
          placeholder="Oil on canvas"
          value={art.materials}
          onChange={(e) => setArt({ ...art, materials: e.target.value })}
        />
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>作品を販売する/Sale this piece</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={art.salesPriceYen !== null}
          onChange={(e) =>
            setArt({
              ...art,
              salesPriceYen: e.target.checked ? 29800 : null,
            })
          }
        />
        <Desc>作品を販売しない場合は、チェックを外してください。</Desc>
      </div>
      {art.salesPriceYen ? (
        <SubEditAttributeElement>
          <AttributeName>販売価格(円) / Price to sell(JPY)</AttributeName>
          <InputField
            type="tel"
            value={art.salesPriceYen}
            onChange={(e) =>
              setArt({ ...art, salesPriceYen: validateNum(e.target.value) })
            }
          />
        </SubEditAttributeElement>
      ) : null}
      <Spacer size="40px" />
      <div>
        <AttributeName>作品の展示可否 / Exhibition Availability</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={art.rentalPriceYen !== null}
          onChange={(e) =>
            setArt({
              ...art,
              rentalPriceYen: e.target.checked ? 4900 : null,
            })
          }
        />
        <Desc>作品の展示依頼を拒否する場合は、チェックを外してください。</Desc>
      </div>
      <Spacer size="40px" />
      <div>
        <AttributeName>公開設定 / Publishing Settings</AttributeName>
        <InputCheckbox
          type="checkbox"
          checked={art.showPublic}
          onChange={(e) => setArt({ ...art, showPublic: e.target.checked })}
        />
        <Desc>
          {art.showPublic
            ? "チェックを外すと作品を登録しても、作品は公開されません。"
            : "チェックをすると作品を登録したとき、作品が公開されます。"}
        </Desc>
      </div>
    </div>
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

const SubEditAttributeElement = styled.div`
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

export default EditAttributes;
