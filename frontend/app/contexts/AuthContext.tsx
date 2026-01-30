'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { rolePermissions, Role, Permission } from '../lib/permissions';
import { getStore, User as DbUser, getUsers } from '../lib/mockDb';
import { useTenant } from './TenantContext';

// Storage key for persisting selected user/role
const AUTH_STORAGE_KEY = 'saas_dashboard_auth';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  organizationId: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role;
  loading: boolean;
  isAuthenticated: boolean;
  permissions: Permission;
  hasPermission: (permission: keyof Permission) => boolean;
  setRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredAuth {
  userId?: string;
  role?: Role;
}

function loadAuthFromStorage(): StoredAuth {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveAuthToStorage(auth: StoredAuth): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { currentOrganization } = useTenant();

  // Get stored auth state
  const [storedAuth] = useState<StoredAuth>(() => loadAuthFromStorage());

  // State
  const [currentRole, setCurrentRole] = useState<Role>(storedAuth.role || 'admin');
  const [currentUserId, setCurrentUserId] = useState<string | null>(storedAuth.userId || null);

  // Get users for current org from mockDb
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    if (currentOrganization) {
      const store = getStore();
      const orgUsers = store.users.filter(u => u.organizationId === currentOrganization.id && u.isActive);
      setAvailableUsers(orgUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        organizationId: u.organizationId,
      })));

      // If no current user selected or user not in org, select first available
      if (!currentUserId || !orgUsers.find(u => u.id === currentUserId)) {
        // Try to find user matching stored role, or take first
        const matchingUser = orgUsers.find(u => u.role === currentRole) || orgUsers[0];
        if (matchingUser) {
          setCurrentUserId(matchingUser.id);
          setCurrentRole(matchingUser.role);
        }
      }
    }
  }, [currentOrganization, currentUserId, currentRole]);

  // Current user object
  const currentUser: User | null = availableUsers.find(u => u.id === currentUserId) || availableUsers[0] || null;

  // Override role manually (for demo purposes)
  const effectiveRole = currentRole;
  const permissions = rolePermissions[effectiveRole];

  const hasPermission = useCallback((permission: keyof Permission): boolean => {
    return permissions[permission];
  }, [permissions]);

  const setRole = useCallback((role: Role) => {
    setCurrentRole(role);
    saveAuthToStorage({ userId: currentUserId || undefined, role });

    // Find a user with this role in the current org
    const userWithRole = availableUsers.find(u => u.role === role);
    if (userWithRole) {
      setCurrentUserId(userWithRole.id);
    }
  }, [availableUsers, currentUserId]);

  const switchUser = useCallback((userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setCurrentRole(user.role);
      saveAuthToStorage({ userId, role: user.role });
    }
  }, [availableUsers]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: effectiveRole,
        loading: false,
        isAuthenticated: true,
        permissions,
        hasPermission,
        setRole,
        switchUser,
        availableUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Default fallback if not wrapped
    const permissions = rolePermissions['admin'];
    return {
      currentUser: {
        id: 'user_1',
        name: 'Sarah Chen',
        email: 'sarah@acme.com',
        role: 'admin' as Role,
        organizationId: 'org_1',
      },
      currentRole: 'admin' as Role,
      loading: false,
      isAuthenticated: true,
      permissions,
      hasPermission: (permission: keyof Permission) => permissions[permission],
      setRole: () => { },
      switchUser: () => { },
      availableUsers: [],
    };
  }
  return context;
}
