import React from "react";
import styles from "./Button.module.scss";
import Color from "utils/colors";

type Props = {
  bg: Color;
  disabled: boolean;
  onClick: () => void;
};

const Button: React.FC<Props> = React.memo(({ bg, disabled, onClick, children }) => (
  <button
    className={styles.button}
    style={{ ["--bg-color" as any]: bg.hex }}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
));

Button.displayName = "Button";

export default Button;
