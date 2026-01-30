'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, rolePermissions, Permission } from '../lib/permissions';
import { currentUser, User } from '../lib/mockData';

interface AuthContextType {
    user: User;
    role: Role;
    permissions: Permission;
    setRole: (role: Role) => void;
    hasPermission: (permission: keyof Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user] = useState<User>(currentUser);
    const [role, setRole] = useState<Role>(currentUser.role);

    const permissions = rolePermissions[role];

    const hasPermission = (permission: keyof Permission): boolean => {
        return permissions[permission];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                permissions,
                setRole,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
