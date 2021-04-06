import React from "react";

export const NoSsr: React.FC = ({ children }) => {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    setRender(true);
  }, []);

  return <React.Fragment>{render ? children : null}</React.Fragment>;
};
