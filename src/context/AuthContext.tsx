import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { useContext } from "react";

type DecodedToken = {
  user_id: number;
  role_id: number;
  role_name: string;
  name: string;
  email: string;
  mobile: string;
  iat: number;
  exp: number;
};

type AuthContextType = {
  user: DecodedToken | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token on app start
useEffect(() => {
  const loadUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const decoded: DecodedToken = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);

        console.log("📦 Loaded Token from Storage:", storedToken);
        console.log("📦 Loaded Decoded User:", decoded);
      }
    } catch (error) {
      console.log("Error loading token:", error);
    } finally {
      setLoading(false);
    }
  };
  loadUserData();
}, []);


  const login = async (newToken: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(newToken);
      setUser(decoded);
      setToken(newToken);
      await AsyncStorage.setItem("token", newToken);
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


 export const useAuth = () => {
  return useContext(AuthContext);
};