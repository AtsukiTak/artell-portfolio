import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import * as D from "@mojotech/json-type-validation";

import { request as req, Method } from "libs/http";
import * as colors from "libs/colors";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import Button from "components/atoms/Button";
import { Paragraph, Text } from "components/atoms/Text";
import TextField from "components/atoms/TextField";
import Header from "components/organisms/Header";

import type { ReqData, ResData } from "pages/api/signin";
import { Redirect } from "next";

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
    signinRequest({ email, password })
      .then(() => {
        const redirect = router.query.redirect;
        if (typeof redirect === "string") {
          router.push(redirect);
        } else {
          router.push("/settings/profile");
        }
      })
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
        <Spacer size="20px" />
        <Link href="/send_password_reset">
          <a>
            <Text size={0.8} color={colors.gray50}>
              パスワードを忘れた方
            </Text>
          </a>
        </Link>
      </Container>
    </>
  );
};

/*
 * ==================
 * signin API request
 * ==================
 */
const signinRequest = (body: ReqData): Promise<ResData> =>
  req({
    method: Method.POST,
    url: "/api/signin",
    body,
    decoder: ResDataDecoder,
  });

const ResDataDecoder: D.Decoder<ResData> = D.object({
  success: D.boolean(),
  msg: D.string(),
});

/*
 * ==============================
 * redirect to signin page object
 * ==============================
 *
 * which is used under another page's `SSR` context.
 */
export const redirectToSigninPage = (dst: string): Redirect => ({
  destination: `/signin?redirect=${encodeURIComponent(dst)}`,
  permanent: false,
});

export default SigninPage;
