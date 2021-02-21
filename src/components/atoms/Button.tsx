import React from "react";
import styles from "./Button.module.scss";
import Color from "utils/colors";

type Props = {
  bg: Color;
  onClick: () => void;
};

const Button: React.FC<Props> = React.memo(({ bg, onClick, children }) => (
  <button
    className={styles.button}
    style={{ ["--bg-color" as any]: bg.hex }}
    onClick={onClick}
  >
    {children}
  </button>
));

Button.displayName = "Button";

export default Button;
