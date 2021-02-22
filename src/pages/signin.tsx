import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as D from "@mojotech/json-type-validation";
import TextField from "@material-ui/core/TextField";

import { request as req, Method } from "infras/http";
import { getFirebaseApp } from "utils/firebase";
import * as colors from "utils/colors";
import Header from "components/Header";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { TextArea, Text } from "components/atoms/Text";

const SigninPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [isInvalidCred, setIsInvalidCred] = React.useState(false);

  const router = useRouter();

  const onEmailInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setIsInvalidCred(false);
    },
    []
  );

  const onPasswordInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPass(e.target.value);
      setIsInvalidCred(false);
    },
    []
  );

  const onSubmit = React.useCallback(() => {
    requestSignin(email, pass)
      .then(() => router.push("/settings"))
      .catch((e) => {
        console.log(e);
        setIsInvalidCred(true);
      });
  }, [email, pass, router]);

  return (
    <>
      <Header />
      <Spacer size="20vh" />
      <Container size="sm">
        <StyledTextField label="email" onChange={onEmailInput} />
        <Spacer size="50px" />
        <StyledTextField
          label="password"
          type="password"
          onChange={onPasswordInput}
        />
        <Spacer size="80px" />
        <Button bg={colors.gray90} onClick={onSubmit}>
          <Text color={colors.white}>Sign In</Text>
        </Button>
        {isInvalidCred && (
          <>
            <Spacer size="20px" />
            <TextArea align="left">
              <Text color={colors.tomato}>
                メールアドレスまたはパスワードが違います。
              </Text>
            </TextArea>
          </>
        )}
      </Container>
    </>
  );
};

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const requestSignin = async (
  email: string,
  password: string
): Promise<ResData> =>
  req({
    method: Method.POST,
    url: "/api/signin",
    body: {
      email,
      password,
    },
    decoder: ResDataDecoder,
  });

type ResData = {
  msg: string;
};

const ResDataDecoder: D.Decoder<ResData> = D.object({
  msg: D.string(),
});

export default SigninPage;
