"use client";

import { theme } from "@/constants/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./global.css";
import { AuthProvider } from "@/lib/authentication";

export default function WithMuiTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
