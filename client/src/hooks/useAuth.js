// src/hooks/useAuth.js
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return ctx;
}