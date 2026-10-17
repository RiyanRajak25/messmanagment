import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  role: UserRole | null;
  mess_id: string | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'messmunch_token';
const USER_KEY = 'messmunch_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const role = user?.role || null;
  const mess_id = user?.mess_id || null;

  const login = async (email: string, targetRole?: UserRole) => {
    const res = await api.auth.login(email, targetRole);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(TOKEN_KEY, res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const switchRole = async (targetRole: UserRole) => {
    const emailMap: Record<UserRole, string> = {
      administrator: 'admin@messmunch.edu',
      store_keeper: 'storekeeper@messmunch.edu',
      mess_manager: 'falcon.manager@messmunch.edu',
      finance_staff: 'finance@messmunch.edu',
      vendor: 'vendor@kisanagro.in',
    };
    await login(emailMap[targetRole], targetRole);
  };

  const resetDemoData = async () => {
    await api.dev.resetDemoData();
    window.location.reload();
  };

  useEffect(() => {
    // If no user on first load, initialize with Store Keeper or Admin for demo
    if (!user) {
      login('admin@messmunch.edu', 'administrator');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        mess_id,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
