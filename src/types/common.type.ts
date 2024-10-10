import { IconSource } from "@shopify/polaris";

export type baseMenu = {
  id: number;
  title: string;
  path: string;
  icon: IconSource;
  subMenu?: baseMenu[];
};
