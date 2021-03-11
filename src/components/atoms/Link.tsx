import React from "react";
import NextLink from "next/link";
import styles from "./Link.module.scss";
import Color from "libs/colors";

/*
 * ========
 * Link
 * ========
 */
type LinkProps = {
  href: string;
  // default is "never"
  underline?: "never" | "hover" | "always";
};

export const Link: React.FC<LinkProps> = React.memo(
  ({ href, underline, children }) => {
    const underlineClass = `underline-${underline || "never"}`;
    const underlineClassName = styles[underlineClass];
    const classNames = [styles.link, underlineClassName];

    return (
      <NextLink href={href}>
        <a className={classNames.join(" ")}>{children}</a>
      </NextLink>
    );
  }
);

Link.displayName = "Link";

/*
 * =============
 * ButtonLink
 * =============
 */
type ButtonLinkProps = {
  bg: Color;
  border?: Color;
  href: string;
};

export const ButtonLink: React.FC<ButtonLinkProps> = React.memo(
  ({ bg, border, href, children }) => (
    <NextLink href={href}>
      <a
        className={styles["button-link"]}
        style={{
          border: border ? `1px solid ${border.hex}` : "none",
          backgroundColor: bg.hex,
        }}
      >
        {children}
      </a>
    </NextLink>
  )
);

ButtonLink.displayName = "ButtonLink";
