'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { rolePermissions, Role, Permission } from '../lib/permissions';
import { getStore } from '../lib/mockDb';
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
  mounted: boolean;
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

// Default user for consistent SSR/CSR
const DEFAULT_USER: User = {
  id: 'user_1',
  name: 'Sarah Chen',
  email: 'sarah@acme.com',
  role: 'admin',
  organizationId: 'org_1',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { currentOrganization, mounted: tenantMounted } = useTenant();
  const [mounted, setMounted] = useState(false);

  // Initialize with consistent default values
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [currentUserId, setCurrentUserId] = useState<string>('user_1');

  // Mount effect
  useEffect(() => {
    setMounted(true);
    
    // Load from storage after mount
    const storedAuth = loadAuthFromStorage();
    if (storedAuth.role) {
      setCurrentRole(storedAuth.role);
    }
    if (storedAuth.userId) {
      setCurrentUserId(storedAuth.userId);
    }
  }, []);

  // Get users for current org from mockDb (derived synchronously)
  const availableUsers = React.useMemo(() => {
    if (!currentOrganization || !mounted) {
      // Return default user during SSR or before mount
      return [DEFAULT_USER];
    }
    
    const store = getStore();
    const users = store.users
      .filter(u => u.organizationId === currentOrganization.id && u.isActive)
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        role: u.role,
        organizationId: u.organizationId,
      }));
    
    return users.length > 0 ? users : [DEFAULT_USER];
  }, [currentOrganization, mounted]);

  // Ensure valid current user/role after mount and org changes
  useEffect(() => {
    if (!mounted || !tenantMounted) return;
    
    if (availableUsers.length > 0) {
      const isValidUser = currentUserId && availableUsers.find(u => u.id === currentUserId);

      if (!isValidUser) {
        const matchingUser = availableUsers.find(u => u.role === currentRole) || availableUsers[0];
        if (matchingUser) {
          setCurrentUserId(matchingUser.id);
          setCurrentRole(matchingUser.role);
        }
      }
    }
  }, [availableUsers, currentUserId, currentRole, mounted, tenantMounted]);

  // Current user object - always return a valid user
  const currentUser: User = availableUsers.find(u => u.id === currentUserId) || availableUsers[0] || DEFAULT_USER;

  const permissions = rolePermissions[currentRole];

  const hasPermission = useCallback((permission: keyof Permission): boolean => {
    return permissions[permission];
  }, [permissions]);

  const setRole = useCallback((role: Role) => {
    setCurrentRole(role);
    if (mounted) {
      saveAuthToStorage({ userId: currentUserId, role });
    }

    // Find a user with this role in the current org
    const userWithRole = availableUsers.find(u => u.role === role);
    if (userWithRole) {
      setCurrentUserId(userWithRole.id);
    }
  }, [availableUsers, currentUserId, mounted]);

  const switchUser = useCallback((userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setCurrentRole(user.role);
      if (mounted) {
        saveAuthToStorage({ userId, role: user.role });
      }
    }
  }, [availableUsers, mounted]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        loading: !mounted,
        isAuthenticated: true,
        permissions,
        hasPermission,
        setRole,
        switchUser,
        availableUsers,
        mounted,
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
      currentUser: DEFAULT_USER,
      currentRole: 'admin' as Role,
      loading: false,
      isAuthenticated: true,
      permissions,
      hasPermission: (permission: keyof Permission) => permissions[permission],
      setRole: () => { },
      switchUser: () => { },
      availableUsers: [DEFAULT_USER],
      mounted: false,
    };
  }
  return context;
}
