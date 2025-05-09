// ToastContext.tsx
import { Alert, Snackbar } from "@mui/material";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  JSX,
} from "react";

// Define the type for the toast context
interface ToastContextType {
  showToast: (
    kind: "error" | "info" | "success" | "warning",
    message: string
  ) => void;
  closeToast: () => void;
}

// Create a context for toast messages
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toast, setToast] = useState<{
    open: boolean;
    kind: "error" | "info" | "success" | "warning";
    message: string;
  }>({
    open: false,
    kind: "info",
    message: "",
  });

  const showToast = (
    kind: "error" | "info" | "success" | "warning",
    message: string
  ) => {
    setToast({ open: true, kind, message });
  };

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      {/* Render Snackbar component */}
      {toast.open && (
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={closeToast}
        >
          <Alert
            onClose={closeToast}
            severity={toast.kind}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
}
