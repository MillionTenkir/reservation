"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
interface User {
  data: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    mobile: string;
    // Add other user properties as needed
  };
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isTokenLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      try {
        // console.log("storedToken", storedToken);
        setTokenState(storedToken);
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);
        setIsTokenLoading(false);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("auth-token");
        setUser(null);
        setTokenState(null);
        setIsTokenLoading(false);
      }
    } else {
      setUser(null);
      setTokenState(null);
      setIsTokenLoading(false);
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("auth-token", newToken);
      const decoded = jwtDecode<User>(newToken);
      setUser(decoded);
    } else {
      localStorage.removeItem("auth-token");
      setUser(null);
    }
    setTokenState(newToken);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setToken(null);
    setUser(null);
    // Move router navigation to a separate effect to prevent hooks order issues
  }, []);

  // Handle navigation after logout
  useEffect(() => {
    if (user === null && token === null && !isTokenLoading) {
      // Only redirect if we've actually logged out (not on initial load)
      const storedToken = localStorage.getItem("auth-token");
      if (!storedToken) {
        router.push("/auth/login");
      }
    }
  }, [user, token, isTokenLoading, router]);

  return (
    <AuthContext.Provider
      value={{ user, token, setToken, logout, isTokenLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
