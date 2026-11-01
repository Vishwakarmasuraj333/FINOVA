'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  isAuthenticated: boolean;
  is2FAWaiting: boolean;
  pendingUser: User | null;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string; require2FA?: boolean }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; role: UserRole; orgName: string; pan?: string; gstin?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const defaultUser: User = {
  id: 'usr_super_01',
  name: 'Aditya Kashyap',
  email: 'aditya.kashyap@finova.internal',
  role: 'Super Admin',
  status: 'ACTIVE',
  last_login: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultUser,
  allUsers: [defaultUser],
  isAuthenticated: true,
  is2FAWaiting: false,
  pendingUser: null,
  switchUser: () => {},
  switchRole: () => {},
  login: async () => ({ success: true }),
  verify2FA: async () => ({ success: true }),
  signup: async () => ({ success: true }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [is2FAWaiting, setIs2FAWaiting] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([
    defaultUser,
    {
      id: 'usr_fin_admin_01',
      name: 'Priyanka Sharma',
      email: 'priyanka.sharma@finova.internal',
      role: 'Finance Admin',
      status: 'ACTIVE',
      last_login: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'usr_approver_01',
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@finova.internal',
      role: 'Approver',
      status: 'ACTIVE',
      last_login: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'usr_operator_01',
      name: 'Sneha Deshmukh',
      email: 'sneha.deshmukh@finova.internal',
      role: 'Finance Operator',
      status: 'ACTIVE',
      last_login: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'usr_auditor_01',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@external-audit.com',
      role: 'Read-only Auditor',
      status: 'ACTIVE',
      last_login: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ]);

  useEffect(() => {
    // Check local authentication state
    const authStatus = localStorage.getItem('finova_is_authenticated');
    if (authStatus === 'false') {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllUsers(data);
          const savedUserId = localStorage.getItem('finova_user_id');
          const found = data.find((u: User) => u.id === savedUserId);
          if (found) setCurrentUser(found);
          else setCurrentUser(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('finova_user_id', user.id);
    }
  };

  const switchRole = (role: UserRole) => {
    const user = allUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('finova_user_id', user.id);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const login = async (
    email: string,
    password?: string,
    role?: UserRole
  ): Promise<{ success: boolean; error?: string; require2FA?: boolean }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'Enterprise@Auth#2026' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      const target: User = data.user;
      setCurrentUser(target);
      setIsAuthenticated(true);
      setIs2FAWaiting(false);
      setPendingUser(null);
      localStorage.setItem('finova_user_id', target.id);
      localStorage.setItem('finova_is_authenticated', 'true');
      setAllUsers(prev => {
        const filtered = prev.filter(u => u.id !== target.id);
        return [target, ...filtered];
      });

      return { success: true, require2FA: false };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login error' };
    }
  };

  const verify2FA = async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!code || code.trim().length < 4) {
      return { success: false, error: 'Please enter a valid 6-digit corporate verification OTP / TOTP code.' };
    }

    if (pendingUser) {
      setCurrentUser(pendingUser);
      localStorage.setItem('finova_user_id', pendingUser.id);
    }

    setIsAuthenticated(true);
    setIs2FAWaiting(false);
    setPendingUser(null);
    localStorage.setItem('finova_is_authenticated', 'true');

    return { success: true };
  };

  const signup = async (data: {
    name: string;
    email: string;
    role: UserRole;
    orgName: string;
    pan?: string;
    gstin?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.email) {
      return { success: false, error: 'Corporate Name and Work Email are required.' };
    }

    const newUser: User = {
      id: `usr_reg_${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'ACTIVE',
      last_login: new Date().toISOString(),
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setIs2FAWaiting(false);
    setPendingUser(null);
    localStorage.setItem('finova_user_id', newUser.id);
    localStorage.setItem('finova_is_authenticated', 'true');

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIs2FAWaiting(false);
    setPendingUser(null);
    localStorage.setItem('finova_is_authenticated', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        is2FAWaiting,
        pendingUser,
        switchUser,
        switchRole,
        login,
        verify2FA,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
