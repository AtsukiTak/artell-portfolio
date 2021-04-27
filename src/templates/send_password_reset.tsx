import React from "react";

import { sendPasswordResetMailRequest } from "libs/apis/send_password_reset_mail";
import * as colors from "libs/colors";
import Spacer from "components/atoms/Spacer";
import Container from "components/atoms/Container";
import Button from "components/atoms/Button";
import TextField from "components/atoms/TextField";
import { Text, Paragraph } from "components/atoms/Text";
import Header from "components/organisms/Header";

export const SendPasswordResetPageTemplate: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const onEmailInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setIsError(false);
    },
    []
  );

  const onSubmit = React.useCallback(() => {
    setIsSending(true);
    sendPasswordResetMailRequest({ email })
      .then(() => alert("指定されたメールアドレス宛にメールを送信しました。"))
      .catch((e) => {
        console.log(e);
        setIsError(true);
      })
      .finally(() => {
        setIsSending(false);
      });
  }, [email]);

  const isInputValid = email !== "";
  const isSubmittable = isInputValid && !isSending && !isError;

  return (
    <>
      <Header />
      <Spacer size="20vh" />
      <Container size="sm">
        <Paragraph align="left">
          <Text size={1} color={colors.gray90}>
            パスワードリセットメールを送信するため、
            <br />
            登録されたメールアドレスを入力してください。
          </Text>
        </Paragraph>
        <Spacer size="50px" />
        <TextField label="email" onChange={onEmailInput} />
        <Spacer size="80px" />
        <Button
          bg={isSubmittable ? colors.gray90 : colors.gray30}
          disabled={!isSubmittable}
          onClick={onSubmit}
        >
          <Text color={colors.white}>送信する</Text>
        </Button>
        {isError && (
          <>
            <Spacer size="20px" />
            <Paragraph align="left">
              <Text color={colors.tomato}>ユーザーが見つかりません。</Text>
            </Paragraph>
          </>
        )}
      </Container>
    </>
  );
};
