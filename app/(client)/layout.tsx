"use client";

import { theme } from "@/constants/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "@/lib/authentication";
import "@/app/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WaveLayout } from "@/components/layouts";
import { ToastProvider } from "@/contexts/useToast";

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
          <ToastProvider>
            <WaveLayout>{children}</WaveLayout>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
