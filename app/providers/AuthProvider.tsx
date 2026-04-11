"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChange, getUserData, FirebaseUserData } from "@/lib/firebase";
import { SafeStorage } from "@/lib/storage";
import { userSchema, safeValidate } from "@/lib/validation";

// Auth Context Types
export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  gender?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          if (userData) {
            const formattedUser: User = {
              id: userData.uid,
              name: userData.displayName,
              email: userData.email,
              image: userData.photoURL || "",
              gender: userData.gender,
            };
            
            // Validate user data
            const validation = safeValidate(userSchema, formattedUser);
            if (validation.success) {
              setUserState(formattedUser);
              setIsLoggedIn(true);
              SafeStorage.setJSON("user", formattedUser);
            } else {
              console.error("User data validation failed:", validation.errors);
            }
          }
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      } else {
        setUserState(null);
        setIsLoggedIn(false);
        SafeStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUser = (user: User | null) => {
    if (user) {
      const validation = safeValidate(userSchema, user);
      if (!validation.success) {
        console.error("Invalid user data:", validation.errors);
        return;
      }
      
      setUserState(user);
      setIsLoggedIn(true);
      SafeStorage.setJSON("user", user);
    } else {
      setUserState(null);
      setIsLoggedIn(false);
      SafeStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
    SafeStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};