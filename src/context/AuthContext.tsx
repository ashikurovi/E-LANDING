"use client";

import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getApiUrl, getApiHeaders, API_CONFIG } from "@/lib/api-config";

// Define user session type
export interface UserSession {
  accessToken: string;
  userId: number;
  email: string;
  name?: string;
  companyId: string;
  permissions?: string[];
  user?: {
    id: number;
    email: string;
    name?: string;
    companyId: string;
    companyName?: string;
    [key: string]: any;
  };
}

// Define the AuthContext type
interface AuthContextType {
  userSession: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Helper functions for localStorage
const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredUser = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

const setStoredAuth = (token: string, user: UserSession) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearStoredAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session from storage on mount
  useEffect(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user) {
      setUserSession(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(getApiUrl("/users/login"), {
        email,
        password,
        companyId: API_CONFIG.companyId,
      });

      const { accessToken, user } = response.data;

      if (accessToken && user) {
        const session: UserSession = {
          accessToken,
          userId: user.id,
          email: user.email,
          name: user.name,
          companyId: user.companyId,
          permissions: user.permissions,
          user,
        };

        setStoredAuth(accessToken, session);
        setUserSession(session);
        return { success: true };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Invalid credentials";
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearStoredAuth();
    setUserSession(null);
  };

  return (
    <AuthContext.Provider value={{ userSession, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
