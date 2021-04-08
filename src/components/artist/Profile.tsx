import React, { FC } from "react";
import styled from "styled-components";

// internal modules
import { Artist } from "models/artist";
import FacebookIcon from "components/icons/FacebookIcon";
import TwitterIcon from "components/icons/TwitterIcon";
import InstagramIcon from "components/icons/InstagramIcon";
import { Thumbnail } from "components/molecules/Thumbnail";
import { pc } from "components/Responsive";
import * as color from "libs/colors";

const Profile: FC<{ artist: Artist; downloadedThumbnail: string }> = ({
  artist,
  downloadedThumbnail,
}) => {
  return (
    <Container>
      <StyledSumbnail src={downloadedThumbnail} />
      <TextContent>
        {!!artist.name && (
          <>
            <Tag>- Artist</Tag>
            <Name>{artist.name}</Name>
          </>
        )}
        {!!artist.description && (
          <>
            <Tag>- Description</Tag>
            <Description>{artist.description}</Description>
          </>
        )}
        {/* snsリンクがない場合はなにも表示しない */}
        {(!!artist.facebook || !!artist.twitter || !!artist.instagram) && (
          <Tag>- Social Links</Tag>
        )}
        <Sns>
          {!!artist.facebook && (
            <SnsLink
              href={`https://www.facebook.com/${artist.facebook}`}
              target="_blank"
            >
              <FacebookIcon />
            </SnsLink>
          )}
          {!!artist.twitter && (
            <SnsLink
              href={`https://twitter.com/${artist.twitter}`}
              target="_blank"
            >
              <TwitterIcon />
            </SnsLink>
          )}
          {!!artist.instagram && (
            <SnsLink
              href={`https://www.instagram.com/${artist.instagram}/`}
              target="_blank"
            >
              <InstagramIcon />
            </SnsLink>
          )}
        </Sns>
      </TextContent>
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  width: 100%;
  margin-top: 50px;
  padding: 0 24px;
  ${pc(`
    width: 800px;
    height: 100%;
    margin: 0 auto;
    margin-top: 90px;
    padding: 0;
  `)}
`;

const StyledSumbnail = styled(Thumbnail)`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  ${pc(`
    display: inline-block;
    width: 400px;
  `)}
`;

const TextContent = styled.div`
  vertical-align: top;
  height: 100%;
  width: 100%;
  max-width: 400px;
  margin: 24px auto;

  ${pc(`
    display: inline-block;
    width: 290px;
    margin-top: 0;
    margin-left: 110px;
  `)}
`;

const Tag = styled.div`
  color: ${color.gray30.hex};
  text-align: left;
  font-size: 12px;
  letter-spacing: 2px;
`;

const Name = styled.div`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 32px;
  color: ${color.gray80.hex};
  text-align: left;
  font-size: 14px;
  letter-spacing: 2px;
`;

const Description = styled.div`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 32px;
  color: ${color.gray80.hex};
  font-size: 14px;
  line-height: 32px;
  word-break: break-all;

  ${pc(`
    font-size: 14px;
    line-height: 28px;
  `)}
`;

const Sns = styled.div`
  text-align: left;
  margin-top: 12px;
  margin-bottom: 32px;
`;

const SnsLink = styled.a`
  margin-right: 15px;
  & svg {
    width: 20px;
    height: 20px;
  }
`;
