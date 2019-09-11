import React, { ReactElement } from "react";
import { Route as OriginalRoute, RouteComponentProps } from "react-router-dom";

const RouterContext = React.createContext<RouteComponentProps | null>(null);

interface RouteProps {
  children: ((props: RouteComponentProps<any>) => ReactElement) | ReactElement;
  path: string | string[];
  exact?: boolean;
}

export const Route: React.FC<RouteProps> = ({ children, path, exact }) => (
  <OriginalRoute
    path={path}
    exact={exact}
    render={routeProps => (
      <RouterContext.Provider value={routeProps}>
        {isReactElement(children) ? children : children(routeProps)}
      </RouterContext.Provider>
    )}
  />
);

function isReactElement(children: any): children is ReactElement {
  return children.props !== undefined;
}

export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter MUST be used inside Router");
  } else {
    return context;
  }
}
