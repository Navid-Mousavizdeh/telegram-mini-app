"use client";

import { theme } from "@/constants/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./global.css";

export default function WithMuiTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
