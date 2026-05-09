import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );

  const login = (authData) => {
    setUser(authData.user);
    setToken(authData.token);

    localStorage.setItem("user", JSON.stringify(authData.user));
    localStorage.setItem("token", authData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("user");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const value = useMemo(
    () => ({ user, token, login, logout, setUser }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
