import React from "react";
import styled from "styled-components";

import { Artist } from "models/artist";

interface Props {
  attrs: Artist;
  onUpdate: (updator: (attrs: Artist) => Artist) => void;
}

const EditAttributes: React.FC<Props> = ({ attrs, onUpdate }) => {
  const updateName = useUpdator("name", onUpdate);
  const updateComment = useUpdator("comment", onUpdate);
  const updateDescription = useUpdator<HTMLTextAreaElement>(
    "description",
    onUpdate
  );
  const updateTwitter = useUpdator("twitter", onUpdate);
  const updateFacebook = useUpdator("facebook", onUpdate);
  const updateInstagram = useUpdator("instagram", onUpdate);

  return (
    <Container>
      <EditAttributeElement>
        <AttributeName>名前 / Name</AttributeName>
        <InputField type="text" value={attrs.name} onChange={updateName} />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>ヒトコト / Status Message</AttributeName>
        <InputField
          type="text"
          value={attrs.comment}
          onChange={updateComment}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>プロフィール / Profile</AttributeName>
        <TextField value={attrs.description} onChange={updateDescription} />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Twitter</AttributeName>
        <InputField
          type="text"
          value={"@" + attrs.twitter}
          onChange={updateTwitter}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Facebook</AttributeName>
        <InputField
          type="text"
          placeholder="artell.life.42"
          value={attrs.facebook}
          onChange={updateFacebook}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Instagram</AttributeName>
        <InputField
          type="text"
          placeholder="artell.gallery"
          value={attrs.instagram}
          onChange={updateInstagram}
        />
      </EditAttributeElement>
    </Container>
  );
};

const useUpdator = <
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
>(
  property: string,
  onUpdate: (updator: (artist: Artist) => Artist) => void
): ((e: React.ChangeEvent<T>) => void) => {
  return React.useCallback(
    (e: React.ChangeEvent<T>) => {
      onUpdate((artist) => ({ ...artist, [property]: e.target.value }));
    },
    [property, onUpdate]
  );
};

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
  &::placeholder {
    font-size: 12px;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
      sans-serif;
  }
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
  &::placeholder {
    font-size: 12px;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto,
      sans-serif;
  }
`;

export default EditAttributes;
