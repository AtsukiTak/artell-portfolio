import React from "react";
import { Color } from "libs/colors";
import styles from "./Text.module.css";

interface ParagraphProps {
  align?: "left" | "center" | "right";
  nowrap?: boolean;
}

export const Paragraph: React.FC<ParagraphProps> = React.memo(
  ({ align, nowrap, children }) => (
    <p
      style={{
        padding: 0,
        margin: 0,
        textAlign: align || "center",
        whiteSpace: nowrap ? "nowrap" : "normal",
      }}
    >
      {children}
    </p>
  )
);

Paragraph.displayName = "Paragraph";

type TextProps = {
  size?: number;
  color: Color;
  bold?: boolean;
};

export const Text: React.FC<TextProps> = React.memo(
  ({ size, color, bold, children }) => (
    <span
      className={styles.text}
      style={{
        fontSize: `${size || 1}rem`,
        color: color.hex,
        fontWeight: bold ? "bold" : "normal",
      }}
    >
      {children}
    </span>
  )
);

Text.displayName = "Text";
