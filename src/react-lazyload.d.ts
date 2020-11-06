import LazyLoad, { LazyLoadProps } from "react-lazyload";

declare module "react-lazyload" {
  export interface LazyLoadProps {
    style: { [key: string]: string };
  }

  export default LazyLoad;
}

