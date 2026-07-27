import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUserData } from "../data/mockData";

const AuthContext = createContext(null);
const API_URL = "http://localhost:5001/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  const buildUser = (apiUser) => {
    if (!apiUser) return null;
    return {
      ...mockUserData,
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
    };
  };

  useEffect(() => {
    if (!localStorage.getItem('skillnova_uuid')) {
      const fallbackUuid = 'anon-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('skillnova_uuid', fallbackUuid);
    }

    const verifyUser = async () => {
      const token = localStorage.getItem("skillnova_token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(buildUser(userData));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("skillnova_token");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setIsTransitioning(true);
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem("skillnova_token", data.token);
      setUser(buildUser(data));
      setIsAuthenticated(true);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsTransitioning(false);
          resolve(true);
        }, 1200);
      });
    } catch (error) {
      setIsTransitioning(false);
      throw error;
    }
  };

  const register = async (email, password, fullName) => {
    setIsTransitioning(true);
    
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      localStorage.setItem("skillnova_token", data.token);
      setUser(buildUser(data));
      setIsAuthenticated(true);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsTransitioning(false);
          resolve(true);
        }, 1200);
      });
    } catch (error) {
      setIsTransitioning(false);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("skillnova_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isTransitioning,
        loading,
        login,
        register,
        logout,
        setIsTransitioning
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
