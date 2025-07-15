'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }
    // 🧠 New: immediately check login state after token update
    checkLoginStatus();
  };

  // ✅ Extract to reuse on mount and after login
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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setTokenState(storedToken); // don’t call setToken here to avoid checkLogin twice
    }
    checkLoginStatus(); // ✅ run on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
