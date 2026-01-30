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
    const { currentRole, hasPermission } = useAuth();

    // Check role requirement
    if (requiredRole) {
        if (!currentRole) {
            return <>{fallback}</>;
        }
        const roleHierarchy: Role[] = ['admin', 'manager', 'viewer'];
        const currentRoleIndex = roleHierarchy.indexOf(currentRole);
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
