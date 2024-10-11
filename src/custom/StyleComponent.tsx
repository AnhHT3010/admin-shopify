import { TextField } from "@mui/material";
import { Button } from "@shopify/polaris";
import styled from "styled-components";

//  when I use more Polaris component: Page, Grid, Layout, these styled-components is not necesary
export const ButtonStyled = styled(Button)(() => ({
  width: "fit-content !important",
  "& .Polaris-Button": {
    width: "fit-content !important",
    backgroundColor: "#99c0e8 !important",
  },
}));

export const TextFieldStyled = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px !important",
  },
  "& .MuiInputBase-input": {
    padding: "5px 11px !important",
  },
  "& .MuiFormHelperText-root": {
    color: "#8E0B21",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    margin: "3px 0px",
  },
  "& fieldset": {
    // border: "none !important",
  },
  marginTop: "3px !important",
  width: "100%",
}));
