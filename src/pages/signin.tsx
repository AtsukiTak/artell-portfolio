import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import * as D from "@mojotech/json-type-validation";

import { request as req, Method } from "infras/http";
import { getFirebaseApp } from "utils/firebase";
import * as colors from "utils/colors";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { Paragraph, Text } from "components/atoms/Text";
import TextField from "components/atoms/TextField";
import Header from "components/organisms/Header";

const SigninPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isUnauthorized, setIsUnauthorized] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const router = useRouter();

  const onEmailInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setIsUnauthorized(false);
    },
    []
  );

  const onPasswordInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setIsUnauthorized(false);
    },
    []
  );

  const onSubmit = React.useCallback(() => {
    setIsSending(true);
    requestSignin(email, password)
      .then(() => router.push("/settings"))
      .catch((e) => {
        console.log(e);
        setIsUnauthorized(true);
        setIsSending(false);
      });
  }, [email, password, router]);

  const isInputValid = email !== "" && password !== "";
  const isSubmittable = isInputValid && !isSending;

  return (
    <>
      <Header />
      <Spacer size="20vh" />
      <Container size="sm">
        <TextField label="email" onChange={onEmailInput} />
        <Spacer size="50px" />
        <TextField
          label="password"
          type="password"
          onChange={onPasswordInput}
        />
        <Spacer size="80px" />
        <Button
          bg={isSubmittable ? colors.gray90 : colors.gray30}
          disabled={!isSubmittable}
          onClick={onSubmit}
        >
          <Text color={colors.white}>Sign In</Text>
        </Button>
        {isUnauthorized && (
          <>
            <Spacer size="20px" />
            <Paragraph align="left">
              <Text color={colors.tomato}>
                メールアドレスまたはパスワードが違います。
              </Text>
            </Paragraph>
          </>
        )}
      </Container>
    </>
  );
};

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
