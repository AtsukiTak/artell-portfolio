import React, {FC, useState} from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';

import {Artist, updateArtist} from 'models/artist';

interface Props {
  fbUser: firebase.User;
  artist: Artist;
}

const EditAttributesComponent: FC<Props> = ({fbUser, artist}) => {
  const [name, setName] = useState(artist.name);
  const [displayId, setDisplayId] = useState(artist.displayId);
  const [comment, setComment] = useState(artist.comment);
  const [description, setDescription] = useState(artist.description);
  const [twitter, setTwitter] = useState(artist.twitter);
  const [facebook, setFacebook] = useState(artist.facebook);
  const [instagram, setInstagram] = useState(artist.instagram);

  const onUpdateRequested = () => {
    updateArtist(fbUser, {
      email: artist.email,
      name: name,
      displayId: displayId,
      comment: comment,
      description: description,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <Container>
      <EditAttributeElement>
        <AttributeName>Name</AttributeName>
        <InputField
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>ID</AttributeName>
        <InputField
          type="text"
          value={displayId}
          onChange={e => setDisplayId(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Comment</AttributeName>
        <InputField
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Description</AttributeName>
        <TextField
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Twitter</AttributeName>
        <InputField
          type="text"
          value={'@' + twitter}
          onChange={e => setTwitter(e.target.value.slice(1))}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Facebook</AttributeName>
        <InputField
          type="text"
          placeholder="artell.life.42"
          value={facebook}
          onChange={e => setFacebook(e.target.value)}
        />
      </EditAttributeElement>
      <EditAttributeElement>
        <AttributeName>Instagram</AttributeName>
        <InputField
          type="text"
          placeholder="artell.gallery"
          value={instagram}
          onChange={e => setInstagram(e.target.value)}
        />
      </EditAttributeElement>
      <SubmitButton onClick={onUpdateRequested}>Update</SubmitButton>
    </Container>
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

const SubmitButton = styled.button`
  display: block;
  width: 100px;
  height: 40px;
  margin: 0 auto;
  margin-top: 30px;
  border: none;
  border-radius: 4px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  color: white;
`;

export default EditAttributesComponent;
