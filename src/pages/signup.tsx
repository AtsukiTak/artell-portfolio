import React from "react";
import { useRouter } from "next/router";

import * as colors from "libs/colors";
import { signupRequest } from "libs/apis/signup";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { Paragraph, Text } from "components/atoms/Text";
import TextField from "components/atoms/TextField";
import Header from "components/organisms/Header";

type Input = {
  name?: string;
  email?: string;
  password?: string;
};

const SigninPage: React.FC = () => {
  const [input, setInput] = React.useState<Input>({});
  const [isSending, setIsSending] = React.useState(false);

  const router = useRouter();

  const onNameInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, name: e.target.value }));
    },
    []
  );

  const onEmailInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, email: e.target.value }));
    },
    []
  );

  const onPasswordInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, password: e.target.value }));
    },
    []
  );

  // 入力のバリデーション
  const validateResult = validate(input);
  const isSubmittable = validateResult.result === "complete" && !isSending;

  const onSubmit = React.useCallback(() => {
    if (validateResult.result !== "complete") return;

    setIsSending(true);
    signupRequest({
      name: validateResult.input.name,
      email: validateResult.input.email,
      password: validateResult.input.password,
    })
      .then(() => {
        router.push("/settings/profile");
      })
      .catch((e) => {
        console.log(e);
        setIsSending(false);
      });
  }, [validateResult, router]);

  return (
    <>
      <Header />
      <Container size="sm">
        <Spacer size="10vh" />
        <TextField label="name" onChange={onNameInput} />
        <Spacer size="50px" />
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
          <Text color={colors.white}>Sign Up</Text>
        </Button>
        {validateResult.result === "error" && (
          <>
            <Spacer size="20px" />
            <Paragraph align="left">
              <Text color={colors.tomato}>{validateResult.msg}</Text>
            </Paragraph>
          </>
        )}
      </Container>
    </>
  );
};

type ValidateResult =
  | {
      result: "error";
      msg: string;
    }
  | {
      result: "incomplete";
    }
  | {
      result: "complete";
      input: ValidInput;
    };

type ValidInput = Required<Input>;

const validateErr = (msg: string): ValidateResult => ({
  result: "error",
  msg,
});

const validate = (input: Input): ValidateResult => {
  // エラーかどうかチェック
  if (input.name !== undefined && input.name === "") {
    return validateErr("nameを入力してください");
  }
  if (input.email !== undefined && input.email === "") {
    return validateErr("emailを入力してください");
  }
  if (input.password !== undefined) {
    if (input.password === "") {
      return validateErr("passwordを入力してください");
    }
    if (input.password.length < 8) {
      return validateErr("passwordは8文字以上で入力してください");
    }
  }

  // 未入力状態かどうかチェック
  if (
    input.name === undefined ||
    input.email === undefined ||
    input.password === undefined
  ) {
    return { result: "incomplete" };
  }

  // validな入力オブジェクトを返す
  return {
    result: "complete",
    input: {
      name: input.name,
      email: input.email,
      password: input.password,
    },
  };
};

export default SigninPage;
