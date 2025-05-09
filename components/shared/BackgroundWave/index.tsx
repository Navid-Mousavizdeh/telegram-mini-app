"use client";
import React from "react";
import Wave from "react-wavify";
import Box from "@mui/material/Box";
import { theme } from "@/constants/theme";
import { WaveContainer } from "../styled";

export default function BackgroundWave() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Box sx={{ width: "100%", position: "relative", height: "100%" }}>
        {/* First layered wave */}
        <WaveContainer>
          <Wave
            fill={`${theme.palette.primary.main}60`}
            paused={false}
            style={{ display: "flex" }}
            options={{
              height: 20,
              amplitude: 20,
              speed: 0.15,
              points: 3,
            }}
          />
        </WaveContainer>
      </Box>
    </Box>
  );
}
