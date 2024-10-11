import { Button } from "@shopify/polaris";
import styled from "styled-components";

//  when I use more Polaris component: Page, Grid, Layout, these styled-components is not necesary
export const ButtonStyled = styled(Button)({
  width: "fit-content !important",
  "& .Polaris-Button": {
    width: "fit-content !important",
    backgroundColor: "#99c0e8 !important",
  },
});
