"use client";

import { theme } from "@/constants/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/lib/authentication";
import "@/app/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WaveLayout } from "@/components/layouts";

// Create a new QueryClient instance
const queryClient = new QueryClient();

export default function WithMuiTheme({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <WaveLayout>{children}</WaveLayout>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
