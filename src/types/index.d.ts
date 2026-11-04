declare module "*.svg" {
  import React from "react";
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.svg?react" {
  // Each ambient module has its own scope; the core rule sees one file.
  // eslint-disable-next-line no-duplicate-imports
  import React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.css" {
  const content: string;
  export default content;
}