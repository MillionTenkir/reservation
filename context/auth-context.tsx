"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FullPageSpinner } from "@/components/ui/spinner";
import { jwtDecode } from "jwt-decode";


// Add this mock users array at the top of the file, after the imports
// const userIds = [
// {superadmin: "cb57b04b-3418-42b9-83e9-d770aa54875a"},
// {organization_manager: "b7dffb6d-8c49-4705-ae2b-ebd70555cac7"},
// {branch_manager: "01bf91c3-abb9-4c5c-8b84-364dd28e8688"},
// {field_agent: "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc"},
// {restaurant_officer: "ff59819f-102b-4fb9-9399-e3e44ed7386e"},
// {restaurant_administrator: "4f0b86ba-9c17-4543-8542-1041da444fa3"},
// {tv_access: "94e2be4f-184f-4ecb-a5e3-087e8245d8cc"},
// ]

type User = {
  id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  role: string;
  branch_id: string;
  organization_id: string;
  token: string;
};

type TokenData = {
  data: {
    id: string;
    firstname: string;
    lastname: string;
    mobile: string;
    role: {
      auth_role_id: string;
    };
    employee: {
      branch_id: string;
      organization_id: string;
    };
  };
};
type AuthContextType = {
  user: User | null;
  login: (mobile: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the JWT token to get user data using jwt-decode
        const tokenData = jwtDecode<TokenData>(token);
        console.log("User data:", tokenData);

        setUser({
          id: tokenData.data.id,
          firstname: tokenData.data.firstname,
          lastname: tokenData.data.lastname,
          role: tokenData.data.role.auth_role_id,
          mobile: tokenData.data.mobile,
          branch_id: tokenData.data.employee.branch_id,
          organization_id: tokenData.data.employee.organization_id,
          token,
        });
        router.push("/dashboard");
        console.log("User logged in");
      } catch (err) {
        console.error("Failed to parse token", err);
        localStorage.removeItem("token");
      }
    }

    // Add a small delay to ensure the spinner is visible
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Replace the entire login function with this simplified version
  const login = async (mobile: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/validatePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token } = await response.json();

      // Extract user data from token using jwt-decode
      const tokenData = jwtDecode<TokenData>(token);
      console.log("User data:", tokenData);

      // Store token
      localStorage.setItem("token", token);

      // Set user state with data from token
      setUser({
        id: tokenData.data.id,
        firstname: tokenData.data.firstname,
        lastname: tokenData.data.lastname,
        role: tokenData.data.role.auth_role_id,
        mobile: tokenData.data.mobile,
        branch_id: tokenData.data.employee.branch_id,
        organization_id: tokenData.data.employee.organization_id,
        token,
      });
      console.log("User logged in");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setUser(null);

    // Add a small delay to show the spinner during logout
    setTimeout(() => {
      router.push("/");
      setIsLoading(false);
    }, 500);
  };

  // Show the spinner when loading
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
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
