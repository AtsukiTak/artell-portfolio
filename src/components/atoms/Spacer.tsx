import React from "react";
import styles from "./Spacer.module.scss";

type Props = {
  size: string;
  // 基本は縦にスペースをとる
  horizontal?: boolean;
};

const Spacer: React.FC<Props> = ({ size, horizontal }) => {
  const { width, height } = React.useMemo(() => {
    const width = horizontal ? size : "1px";
    const height = horizontal ? "1px" : size;
    return { width, height };
  }, [size, horizontal]);

  return (
    <span
      className={styles.spacer}
      style={{
        ["--spacer-width" as any]: width,
        ["--spacer-height" as any]: height,
      }}
    ></span>
  );
};

export default Spacer;
