import styled from 'styled-components';

export const PrimaryButton = styled.button`
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  color: white;

  &:disabled {
    background: lightgray;
    color: gray;
  }
`;

export const DangerButton = styled.button`
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-image: linear-gradient(-180deg, #de4450, #cb2431 90%);
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  color: white;

  &:disabled {
    background: lightgray;
    color: gray;
  }
`;
