import React from "react";
import { Color } from "utils/colors";

interface TextAreaProps {
  align?: "left" | "center" | "right";
  nowrap?: boolean;
}

export const Paragraph: React.FC<TextAreaProps> = React.memo(
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
