import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FullFlexBox = styled(Box)({
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
});

export const WaveContainer = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  "&>div": {
    height: "100%",
  },
});
