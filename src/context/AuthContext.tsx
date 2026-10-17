import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppUser, UserRole } from '../types';
import { api } from '../api/client';
import { recordSecurityEvent, rateLimiter } from '../utils/security';

interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  role: UserRole | null;
  mess_id: string | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: (reason?: string | React.MouseEvent) => void;
  switchRole: (role: UserRole) => Promise<void>;
  resetDemoData: () => Promise<void>;
  sessionRemainingSeconds?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'messmunch_token';
const USER_KEY = 'messmunch_user';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken && isTokenValid(savedToken)) {
      return savedToken;
    }
    // Expired or invalid
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  });

  const [user, setUser] = useState<AppUser | null>(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken || !isTokenValid(savedToken)) {
      return null;
    }
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(INACTIVITY_TIMEOUT_MS / 1000);
  const lastActivityRef = useRef<number>(Date.now());

  const role = user?.role || null;
  const mess_id = user?.mess_id || null;

  const logout = useCallback((reason?: string | React.MouseEvent) => {
    const reasonStr = typeof reason === 'string' ? reason : 'USER_DISCONNECT';
    recordSecurityEvent({
      type: reasonStr === 'SESSION_TIMEOUT' ? 'SESSION_TIMEOUT' : 'AUTHENTICATION_SUCCESS',
      severity: 'LOW',
      details: `Session terminated: ${reasonStr}. Identity: ${user?.email || 'unknown'}`,
    });
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, [user]);

  const login = async (email: string, targetRole?: UserRole) => {
    // Check brute force rate limiting
    const rateCheck = rateLimiter.check(email);
    if (!rateCheck.allowed) {
      const err = `Account access temporarily locked for security. Try again in ${rateCheck.remainingLockoutSeconds}s.`;
      recordSecurityEvent({
        type: 'BRUTE_FORCE_LOCKOUT',
        severity: 'HIGH',
        details: `Login blocked by rate limiter for ${email}`,
      });
      throw new Error(err);
    }

    try {
      const res = await api.auth.login(email, targetRole);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      localStorage.setItem(TOKEN_KEY, res.token);
      lastActivityRef.current = Date.now();
      rateLimiter.recordSuccess(email);

      recordSecurityEvent({
        type: 'AUTHENTICATION_SUCCESS',
        severity: 'LOW',
        details: `Operational access granted to ${res.user.email} (${res.user.role})`,
      });
    } catch (err: unknown) {
      rateLimiter.recordFailure(email);
      recordSecurityEvent({
        type: 'AUTHENTICATION_FAILURE',
        severity: 'MEDIUM',
        details: `Failed sign-in attempt for email ${email}`,
      });
      throw err;
    }
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

  // Activity listeners for Inactivity Session Lockout
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((evt) => window.addEventListener(evt, updateActivity, { passive: true }));

    const timer = setInterval(() => {
      if (!user) return;
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
      setSessionRemainingSeconds(remaining);

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        logout('SESSION_TIMEOUT');
      }
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, updateActivity));
      clearInterval(timer);
    };
  }, [user, logout]);

  // Initial load check - if no user, provide administrator for seamless demonstration
  useEffect(() => {
    if (!user) {
      login('admin@messmunch.edu', 'administrator').catch(() => {});
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        mess_id,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        switchRole,
        resetDemoData,
        sessionRemainingSeconds,
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
