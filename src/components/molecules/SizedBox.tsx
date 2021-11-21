import React from "react";
import styles from "./SizedBox.module.scss";

type Props = {
  heightRatio?: number;
};

const SizedBox: React.FC<Props> = React.memo(
  ({ heightRatio = 1, children }) => {
    return (
      <div
        className={styles["square-box"]}
        style={{ paddingBottom: `calc(100% * ${heightRatio})` }}
      >
        <div className={styles["inner-item"]}>{children}</div>
      </div>
    );
  }
);

SizedBox.displayName = "SizedBox";
