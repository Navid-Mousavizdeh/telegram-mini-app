"use client";

import { theme } from "@/constants/theme";
import { ThemeProvider } from "@mui/material";

export default function WithMuiTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
