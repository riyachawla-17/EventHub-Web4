'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  token: string | null;
  setToken: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  token: null,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setToken(null);
        }
      } catch (err) {
        console.error('Error checking login status:', err);
        setIsLoggedIn(false);
        setToken(null);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
