import React, { createContext, useContext, useState } from "react";

export type UserRole = "guest" | "agronomist";

export interface User {
  login: string;
  role: UserRole;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  login: (login: string, password: string) => boolean;
  logout: () => void;
}

const USERS: Array<User & { password: string }> = [
  { login: "guest", password: "guest", role: "guest", name: "Гость" },
  { login: "agronomist", password: "agronomist", role: "agronomist", name: "Агроном" },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("agro_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (loginVal: string, password: string): boolean => {
    const found = USERS.find(
      (u) => u.login === loginVal.trim() && u.password === password
    );
    if (!found) return false;
    const { password: _p, ...userData } = found;
    setUser(userData);
    sessionStorage.setItem("agro_user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("agro_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
