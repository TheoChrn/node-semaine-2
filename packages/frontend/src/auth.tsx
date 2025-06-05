import { useQuery } from "@tanstack/react-query";
import * as React from "react";

export interface AuthContext {
  //   login: (email: string) => Promise<void>;
  //   logout: () => Promise<void>;
  user?: {
    email: string;
    role: "user" | "admin";
    firstName?: string;
    lastName?: string;
  };
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        return data.data;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    retry: false,
  });

  return (
    <AuthContext.Provider value={{ user: data }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
