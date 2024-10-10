import { Chip } from "@mui/material";
import { ColorCommon } from "../common/CommonColor";
type TChipStyle = {
  label: string;
  rule: string;
};
const ChipStatus = ({ label, rule }: TChipStyle) => {
  const mapStyles: Record<
    TChipStyle["rule"],
    { color: string; background: string }
  > = {
    Active: {
      color: ColorCommon.txtStatusActive,
      background: ColorCommon.bgStatusActive,
    },
    "No rule": {
      color: ColorCommon.txtStatusInactive,
      background: ColorCommon.bgStatusInactive,
    },
  };
  const style = mapStyles[rule];

  return <Chip label={label} sx={style} />;
};

export default ChipStatus;
