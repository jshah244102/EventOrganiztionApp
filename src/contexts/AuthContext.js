import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../config/firebase';
import * as firebaseService from '../config/firebaseService';

export const AuthContext = createContext();
console.log('AuthContext created:', AuthContext); // 🕵️

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, [initializing]);

  const value = {
    user,
    initializing,
    signUp: firebaseService.signUp,
    signIn: firebaseService.signIn,
    logout: firebaseService.logout
  };

  console.log('AuthProvider rendering. Value:', value); // 🕵️

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
