import React from "react";

import * as color from "libs/colors";
import { Art } from "models/art";
import Container from "components/atoms/Container";
import Spacer from "components/atoms/Spacer";
import { Text, Paragraph } from "components/atoms/Text";
import { Link, ButtonLink } from "components/atoms/Link";
import Thumbnail from "components/molecules/Thumbnail";
import Header from "components/organisms/Header";
import Footer from "components/organisms/Footer";
import SettingTab from "components/organisms/settings/SettingTab";

type Props = {
  arts: Art[];
};

const ArtsSettingTemplate: React.FC<Props> = ({ arts }) => {
  return (
    <>
      <Header />
      <SettingTab selected="tab2" />
      <Container size="md">
        <Spacer size="50px" />
        <AddArtButtonLink />
        {arts.map((art) => (
          <React.Fragment key={art.id}>
            <Spacer size="50px" />
            <EditArtLink art={art} />
          </React.Fragment>
        ))}
      </Container>
      <Footer />
    </>
  );
};

const AddArtButtonLink = () => (
  <ButtonLink href="/settings/arts/add" bg={color.white} border={color.gray80}>
    <Paragraph align="center">
      <Text size={13 / 16} color={color.gray80}>
        作品を追加する
      </Text>
    </Paragraph>
  </ButtonLink>
);

const EditArtLink = ({ art }: { art: Art }) => (
  <div>
    <Link href={`/settings/arts/edit/${art.id}`}>
      <Thumbnail src={art.thumbnailUrl} />
      <Paragraph align="center">
        <Text size={12 / 16} color={color.gray80}>
          {art.title}
        </Text>
      </Paragraph>
    </Link>
  </div>
);

export default ArtsSettingTemplate;
