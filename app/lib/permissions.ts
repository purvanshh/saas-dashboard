// Role definitions and capabilities for RBAC

export type Role = 'admin' | 'manager' | 'viewer';

export interface Permission {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canManageOrg: boolean;
  canViewBilling: boolean;
  canViewAuditLogs: boolean;
}

// Permission matrix for each role
export const rolePermissions: Record<Role, Permission> = {
  admin: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canManageOrg: true,
    canViewBilling: true,
    canViewAuditLogs: true,
  },
  manager: {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canManageOrg: false,
    canViewBilling: false,
    canViewAuditLogs: false,
  },
  viewer: {
    canView: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canManageOrg: false,
    canViewBilling: false,
    canViewAuditLogs: false,
  },
};

// Navigation items with required permissions
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  requiredRole?: Role;
  requiredPermission?: keyof Permission;
}

export const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', href: '/analytics' },
  { id: 'projects', label: 'Projects', icon: 'projects', href: '/projects' },
  { id: 'users', label: 'Users', icon: 'users', href: '/users', requiredPermission: 'canManageUsers' },
  { id: 'settings', label: 'Organization Settings', icon: 'settings', href: '/settings', requiredPermission: 'canManageOrg' },
  { id: 'billing', label: 'Billing', icon: 'billing', href: '/billing', requiredPermission: 'canViewBilling' },
  { id: 'audit', label: 'Audit Logs', icon: 'audit', href: '/audit', requiredPermission: 'canViewAuditLogs' },
];

// Helper functions
export function hasPermission(role: Role, permission: keyof Permission): boolean {
  return rolePermissions[role][permission];
}

export function canAccessNavItem(role: Role, item: NavItem): boolean {
  if (!item.requiredPermission) return true;
  return hasPermission(role, item.requiredPermission);
}

export function getRoleBadgeClass(role: Role): string {
  switch (role) {
    case 'admin':
      return 'badge-admin';
    case 'manager':
      return 'badge-manager';
    case 'viewer':
      return 'badge-viewer';
    default:
      return 'badge-viewer';
  }
}

export function getRoleLabel(role: Role): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
