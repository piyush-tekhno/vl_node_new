import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
        console.log("🔄 AuthProvider: Loading token from storage...");
        const storedToken = await AsyncStorage.getItem("token");
        
        if (storedToken) {
          console.log("✅ AuthProvider: Token found in storage");
          const decoded: DecodedToken = jwtDecode(storedToken);
          setUser(decoded);
          setToken(storedToken);

          console.log("📦 Loaded Token from Storage:", storedToken);
          console.log("📦 Loaded Decoded User:", decoded);
        } else {
          console.log("❌ AuthProvider: No token found in storage");
        }
      } catch (error) {
        console.log("❌ AuthProvider: Error loading token:", error);
      } finally {
        setLoading(false);
        console.log("🏁 AuthProvider: Loading complete");
      }
    };
    
    loadUserData();
  }, []);

  const login = async (newToken: string) => {
    try {
      console.log("🔑 AuthProvider: Logging in with token");
      const decoded: DecodedToken = jwtDecode(newToken);
      setUser(decoded);
      setToken(newToken);
      await AsyncStorage.setItem("token", newToken);
      console.log("✅ AuthProvider: Token saved to storage");
    } catch (error) {
      console.log("❌ AuthProvider: Login error:", error);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 AuthProvider: Logging out");
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      console.log("✅ AuthProvider: Token removed from storage");
    } catch (error) {
      console.log("❌ AuthProvider: Logout error:", error);
    }
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