"use client";

import { BackgroundWave } from "@/components/shared";
import { FullFlexBox } from "@/components/shared/styled";
import { fadeInSlideUp } from "@/mixins";
import { Box, Card } from "@mui/material";

export default function WaveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FullFlexBox
      sx={{
        flexDirection: "column",
        backgroundColor: "whitesmoke",
      }}
    >
      {/* Background Layer */}
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          zIndex: 0,
          height: "70%",
        }}
      >
        <BackgroundWave />
      </Box>

      {/* Foreground Content */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "100%", md: "90%" },
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 4, md: 7 },
          }}
        >
          <Card
            sx={{
              width: "100%",
              height: "100%",
              ...fadeInSlideUp(1, 1),
              borderRadius: "16px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              p: 4,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                bottom: 0,
                zIndex: 0,
                background: "url(/images/Section-bg-light-01.svg)",
              }}
            />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {children}
            </Box>
          </Card>
        </Box>
      </Box>
    </FullFlexBox>
  );
}
