'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
}

const defaultUser: User = {
  id: 'usr_super_01',
  name: 'Aditya Kashyap',
  email: 'aditya.kashyap@finova.internal',
  role: 'Super Admin',
  status: 'ACTIVE',
};

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultUser,
  allUsers: [defaultUser],
  switchUser: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [allUsers, setAllUsers] = useState<User[]>([
    defaultUser,
    {
      id: 'usr_fin_admin_01',
      name: 'Priyanka Sharma',
      email: 'priyanka.sharma@finova.internal',
      role: 'Finance Admin',
      status: 'ACTIVE',
    },
    {
      id: 'usr_approver_01',
      name: 'Vikramaditya Singhania',
      email: 'vikram.singhania@finova.internal',
      role: 'Approver',
      status: 'ACTIVE',
    },
    {
      id: 'usr_operator_01',
      name: 'Sneha Deshmukh',
      email: 'sneha.deshmukh@finova.internal',
      role: 'Finance Operator',
      status: 'ACTIVE',
    },
    {
      id: 'usr_auditor_01',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@external-audit.com',
      role: 'Read-only Auditor',
      status: 'ACTIVE',
    },
  ]);

  useEffect(() => {
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

  return (
    <AuthContext.Provider value={{ currentUser, allUsers, switchUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

