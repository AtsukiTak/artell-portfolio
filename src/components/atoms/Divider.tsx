import React from "react";
import Color from "libs/colors";

interface Props {
  color: Color;
  thickness?: string; // 線の太さ
  length?: string; // 線の長さ
  vertical?: boolean;
}

const Divider: React.FC<Props> = React.memo(
  ({ color, thickness = "1px", length = "100%", vertical }) => {
    const width = vertical ? thickness : length;
    const height = vertical ? length : thickness;

    return (
      <div
        style={{
          width,
          height,
          backgroundColor: color.hex,
        }}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
