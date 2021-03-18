import React from "react";

export const useScrollToTop = (): void => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
