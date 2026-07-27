import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { mockUserData } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Controls warp speed in StarField
  const [loading, setLoading] = useState(true);

  // Helper to merge supabase user with our mock data so the UI doesn't break
  const buildUser = (sbUser) => {
    if (!sbUser) return null;
    return {
      ...mockUserData,
      id: sbUser.id,
      email: sbUser.email,
      name: sbUser.user_metadata?.full_name || sbUser.email.split("@")[0].charAt(0).toUpperCase() + sbUser.email.split("@")[0].slice(1),
    };
  };

  useEffect(() => {
    // Generate fallback UUID for anonymous usage
    if (!localStorage.getItem('skillnova_uuid')) {
      const fallbackUuid = 'anon-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('skillnova_uuid', fallbackUuid);
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(buildUser(session?.user));
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(buildUser(session?.user));
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsTransitioning(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return new Promise((resolve, reject) => {
      if (error) {
        setIsTransitioning(false);
        reject(error);
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          resolve(true);
        }, 1200); // Keep warp animation duration
      }
    });
  };

  const register = async (email, password, fullName) => {
    setIsTransitioning(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    return new Promise((resolve, reject) => {
      if (error) {
        setIsTransitioning(false);
        reject(error);
      } else {
        setTimeout(() => {
          setIsTransitioning(false);
          resolve(true);
        }, 1200); // Keep warp animation duration
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
