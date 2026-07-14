import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUserData } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Controls warp speed in StarField
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for session
    const storedUser = localStorage.getItem("skillnova_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve) => {
      // Simulate API lag
      setTimeout(() => {
        // Set transition warp state to true (stars move fast!)
        setIsTransitioning(true);
        
        // After 1200ms of star-travel, finish login
        setTimeout(() => {
          const loggedInUser = {
            ...mockUserData,
            email: email,
            name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
          };
          setUser(loggedInUser);
          setIsAuthenticated(true);
          localStorage.setItem("skillnova_user", JSON.stringify(loggedInUser));
          setIsTransitioning(false);
          resolve(true);
        }, 1500);
      }, 800);
    });
  };

  const register = (email, password, fullName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTransitioning(true);
        
        setTimeout(() => {
          const registeredUser = {
            ...mockUserData,
            email: email,
            name: fullName
          };
          setUser(registeredUser);
          setIsAuthenticated(true);
          localStorage.setItem("skillnova_user", JSON.stringify(registeredUser));
          setIsTransitioning(false);
          resolve(true);
        }, 1500);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("skillnova_user");
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
