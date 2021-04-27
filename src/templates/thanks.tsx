import React from "react";

import * as color from "libs/colors";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import { Paragraph, Text } from "components/atoms/Text";

export const ThanksPageTemplate: React.FC = () => (
  <Container size="md">
    <Spacer size="45vh" />
    <Paragraph align="center" full>
      <Text size={1} bold color={color.gray90}>
        ご購入ありがとうございました！
      </Text>
    </Paragraph>
  </Container>
);
