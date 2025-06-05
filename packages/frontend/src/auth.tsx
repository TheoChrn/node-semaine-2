import { currentUserQueryOptions } from "@/src/routes/__root";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

export interface AuthContext {
  //   login: (email: string) => Promise<void>;
  //   logout: () => Promise<void>;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery(currentUserQueryOptions());

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
