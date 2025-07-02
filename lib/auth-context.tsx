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
import { FullPageSpinner } from "@/components/ui/spinner";

// Client-side user interface
interface ClientUser {
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

// Admin-side user interface
interface AdminUser {
  id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  role: string;
  branch_id: string;
  organization_id: string;
  token: string;
}

interface AdminTokenData {
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
  exp: number;
  iat: number;
}

// Client-side auth context type
interface ClientAuthContextType {
  clientUser: ClientUser | null;
  clientToken: string | null;
  setClientToken: (token: string | null) => void;
  clientLogout: () => void;
  isClientTokenLoading: boolean;
}

// Admin-side auth context type
interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  adminLogin: (mobile: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminLoading: boolean;
  adminError: string | null;
}

// Combined context type
interface CombinedAuthContextType extends ClientAuthContextType, AdminAuthContextType {}

const AuthContext = createContext<CombinedAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Client-side state
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [clientToken, setClientTokenState] = useState<string | null>(null);
  const [isClientTokenLoading, setIsClientTokenLoading] = useState<boolean>(true);

  // Admin-side state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminTokenState] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  const router = useRouter();

  // Client-side token initialization
  useEffect(() => {
    const storedClientToken = localStorage.getItem("auth-token");
    if (storedClientToken) {
      try {
        setClientTokenState(storedClientToken);
        const decoded = jwtDecode<ClientUser>(storedClientToken);
        setClientUser(decoded);
        setIsClientTokenLoading(false);
      } catch (error) {
        console.error("Invalid client token:", error);
        localStorage.removeItem("auth-token");
        setClientUser(null);
        setClientTokenState(null);
        setIsClientTokenLoading(false);
      }
    } else {
      setClientUser(null);
      setClientTokenState(null);
      setIsClientTokenLoading(false);
    }
  }, []);

  // Admin-side token initialization
  useEffect(() => {
    const storedAdminToken = localStorage.getItem("admin-token");
    if (storedAdminToken) {
      try {
        setAdminTokenState(storedAdminToken);
        const decoded = jwtDecode<AdminTokenData>(storedAdminToken);
        
        setAdminUser({
          id: decoded.data.id,
          firstname: decoded.data.firstname,
          lastname: decoded.data.lastname,
          role: decoded.data.role.auth_role_id,
          mobile: decoded.data.mobile,
          branch_id: decoded.data.employee.branch_id,
          organization_id: decoded.data.employee.organization_id,
          token: storedAdminToken,
        });
        
        setIsAdminLoading(false);
      } catch (error) {
        console.error("Invalid admin token:", error);
        localStorage.removeItem("admin-token");
        setAdminUser(null);
        setAdminTokenState(null);
        setIsAdminLoading(false);
      }
    } else {
      setAdminUser(null);
      setAdminTokenState(null);
      setIsAdminLoading(false);
    }
  }, []);

  // Client-side token setter
  const setClientToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("auth-token", newToken);
      const decoded = jwtDecode<ClientUser>(newToken);
      setClientUser(decoded);
    } else {
      localStorage.removeItem("auth-token");
      setClientUser(null);
    }
    setClientTokenState(newToken);
  };

  // Admin-side token setter
  const setAdminToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("admin-token", newToken);
      const decoded = jwtDecode<AdminTokenData>(newToken);
      
      setAdminUser({
        id: decoded.data.id,
        firstname: decoded.data.firstname,
        lastname: decoded.data.lastname,
        role: decoded.data.role.auth_role_id,
        mobile: decoded.data.mobile,
        branch_id: decoded.data.employee.branch_id,
        organization_id: decoded.data.employee.organization_id,
        token: newToken,
      });
    } else {
      localStorage.removeItem("admin-token");
      setAdminUser(null);
    }
    setAdminTokenState(newToken);
  };

  // Admin-side login function
  const adminLogin = async (mobile: string, password: string) => {
    setIsAdminLoading(true);
    setAdminError(null);
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
      setAdminToken(token);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAdminLoading(false);
    }
  };

  // Client-side logout
  const clientLogout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setClientToken(null);
    setClientUser(null);
  }, []);

  // Admin-side logout
  const adminLogout = useCallback(() => {
    setIsAdminLoading(true);
    localStorage.removeItem("admin-token");
    setAdminToken(null);
    setAdminUser(null);
    
    // Add a small delay to show the spinner during logout
    setTimeout(() => {
      router.push("/admin");
      setIsAdminLoading(false);
    }, 500);
  }, [router]);

  // Show the spinner when admin is loading
  if (isAdminLoading) {
    return <FullPageSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{ 
        clientUser, 
        clientToken, 
        setClientToken, 
        clientLogout, 
        isClientTokenLoading,
        adminUser, 
        adminToken, 
        setAdminToken, 
        adminLogin, 
        adminLogout, 
        isAdminLoading, 
        adminError 
      }}
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

// Convenience hooks for specific use cases
export function useClientAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within an AuthProvider");
  }
  return {
    user: context.clientUser,
    token: context.clientToken,
    setToken: context.setClientToken,
    logout: context.clientLogout,
    isLoading: context.isClientTokenLoading,
  };
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  return {
    user: context.adminUser,
    token: context.adminToken,
    setToken: context.setAdminToken,
    login: context.adminLogin,
    logout: context.adminLogout,
    isLoading: context.isAdminLoading,
    error: context.adminError,
  };
}
