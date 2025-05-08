"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const { data } = await axios.get("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        }
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await axios.post("/api/auth/sign-in", {
      username,
      password,
    });
    localStorage.setItem("token", data.token);
    const { data: userData } = await axios.get("/api/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    setUser(userData);
    router.push("/submissions");
  };

  const signup = async (username: string, password: string) => {
    await axios.post("/api/auth/sign-up", { username, password });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
