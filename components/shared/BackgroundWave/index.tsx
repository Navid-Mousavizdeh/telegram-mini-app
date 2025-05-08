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
              height: 10,
              amplitude: 10,
              speed: 0.3,
              points: 4,
            }}
          />
        </WaveContainer>

        {/* Second layered wave */}
        <WaveContainer>
          <Wave
            fill={`${theme.palette.primary.main}20`}
            paused={false}
            style={{ display: "flex" }}
            options={{
              height: 30,
              amplitude: 15,
              speed: 0.2,
              points: 6,
            }}
          />
        </WaveContainer>
        {/* Base wave */}
        <WaveContainer>
          {" "}
          <Wave
            fill={`${theme.palette.primary.main}10`}
            paused={false}
            style={{ display: "flex" }}
            options={{
              height: 30,
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
