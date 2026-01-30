'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Role, Permission } from '../../lib/permissions';

interface PermissionGateProps {
    children: ReactNode;
    requiredRole?: Role;
    requiredPermission?: keyof Permission;
    fallback?: ReactNode;
}

export function PermissionGate({
    children,
    requiredRole,
    requiredPermission,
    fallback = null,
}: PermissionGateProps) {
    const { role, hasPermission } = useAuth();

    // Check role requirement
    if (requiredRole) {
        const roleHierarchy: Role[] = ['admin', 'manager', 'viewer'];
        const currentRoleIndex = roleHierarchy.indexOf(role);
        const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

        if (currentRoleIndex > requiredRoleIndex) {
            return <>{fallback}</>;
        }
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
