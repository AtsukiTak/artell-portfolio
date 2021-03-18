/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "*.svg" {
  /* eslint @typescript-eslint/no-explicit-any: off */
  const content: any;
  export default content;

}
