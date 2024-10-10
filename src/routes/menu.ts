import {
  HomeFilledIcon,
  OrderFilledIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import { baseMenu } from "../types/common.type";

export const menu: baseMenu[] = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: HomeFilledIcon,
  },
  {
    id: 2,
    title: "Products",
    path: "/products",
    icon: OrderFilledIcon,
  },
  {
    id: 3,
    title: "Settings",
    path: "/settings",
    icon: SettingsIcon,
  },
];
