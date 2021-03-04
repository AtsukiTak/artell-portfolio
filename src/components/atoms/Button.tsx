import React from "react";
import styles from "./Button.module.scss";
import Color from "libs/colors";

type Props = {
  bg: Color;
  border?: Color;
  disabled: boolean;
  onClick: () => void;
};

const Button: React.FC<Props> = React.memo(
  ({ bg, border, disabled, onClick, children }) => (
    <button
      className={styles.button}
      style={{
        border: border ? `1px solid ${border.hex}` : "none",
        backgroundColor: bg.hex,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
