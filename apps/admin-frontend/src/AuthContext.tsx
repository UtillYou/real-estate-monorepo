import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, verifyToken, refreshAccessToken, logout as apiLogout } from './api/auth';

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, avatar?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const isAuthenticated = !!user && !!token;

  // Track user activity
  const updateLastActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check auth status on mount and when lastActivity changes
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const userData = await verifyToken();
        if (isMounted) {
          if (userData) {
            setUser(userData.user);
            setToken(localStorage.getItem('token'));
            updateLastActivity();
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          // Clear invalid auth data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [updateLastActivity]);
  
  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!token) return;
    
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    };
    
    const interval = setInterval(checkInactivity, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [token, lastActivity]);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const onActivity = () => {
      updateLastActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, onActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, onActivity);
      });
    };
  }, [updateLastActivity]);

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!token) return;

      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = tokenPayload.exp - now;
        
        // If token will expire in less than 5 minutes, refresh it
        if (expiresIn < 300) { // 5 minutes in seconds
          try {
            const newToken = await refreshAccessToken();
            setToken(newToken);
          } catch (error) {
            console.error('Failed to refresh token:', error);
            await logout();
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        await logout();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data, error } = await apiLogin(email, password);
    
    if (error || !data) {
      throw new Error(error || 'Login failed');
    }
    
    // The refresh token is handled by the login function in auth.ts
    // and stored in localStorage
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);
    
    // Update last activity on login
    updateLastActivity();
  };

  const register = async (email: string, password: string, name: string, avatar?: string) => {
    const { data, error } = await apiRegister(email, password, name, avatar);
    
    if (error || !data) {
      throw new Error(error || 'Registration failed');
    }
    
    // The refresh token is handled by the register function in auth.ts
    // and stored in localStorage
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);
    
    // Update last activity on registration
    updateLastActivity();
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
