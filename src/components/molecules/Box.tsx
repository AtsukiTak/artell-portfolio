import styled from "styled-components";

import Color from "libs/colors";

interface Props {
  // default is 100%.
  width?: string;
  padding?: string;
  bg?: Color;
  // デフォルトでは縦方向にアイテムが並ぶ
  horizontal?: boolean;
  align?: "center" | "baseline" | "start";
  // justify-contentのパラメータ
  // 未指定の場合はjustify-content: normalが指定される
  space?: "between" | "evenly";
  // 改行をするかどうか
  wrap?: boolean;
  border?: Color;
  radius?: number;
}

// デフォルトでは縦方向にアイテムが並ぶ
const Box = styled.div<Props>`
  display: flex;
  width: ${(p) => (p.width ? p.width : "100%")};
  flex-direction: ${(p) => (p.horizontal ? "row" : "column")};
  align-items: ${(p) => p.align || "normal"};
  flex-wrap: ${(p) => (p.wrap ? "wrap" : "nowrap")};
  justify-content: ${(p) => (p.space ? `space-${p.space}` : "normal")};
  padding: ${(p) => p.padding || "0"};
  background-color: ${(p) => p.bg?.hex || "transparent"};
  border: ${(p) => (p.border ? `1px solid ${p.border.hex}` : "none")};
  border-radius: ${(p) => `${p.radius || 0}`}px;
`;

interface ItemProps {
  scale?: number;
}

export const BoxItem = styled.div<ItemProps>`
  flex-shrink: 0;
  flex-grow: ${(p) => p.scale || 0};
`;

export default Box;
