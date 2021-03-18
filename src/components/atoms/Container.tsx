import React from "react";
import styles from "./Container.module.scss";

type Props = {
  size: "sm" | "md" | "lg";
};

const Container: React.FC<Props> = ({ size, children }) => (
  <div className={styles.container + " " + styles[size]}>{children}</div>
);

export default Container;
