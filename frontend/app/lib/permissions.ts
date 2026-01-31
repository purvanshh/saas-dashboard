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
  { id: 'settings', label: 'Profile Settings', icon: 'settings', href: '/settings' },
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
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// ============================================
// ACTION-LEVEL RBAC ENFORCEMENT
// ============================================

export type ActionType =
  // Project actions
  | 'project.create'
  | 'project.edit'
  | 'project.delete'
  | 'project.archive'
  | 'project.view'
  // User actions
  | 'user.invite'
  | 'user.changeRole'
  | 'user.deactivate'
  | 'user.view'
  // Admin actions
  | 'billing.view'
  | 'billing.edit'
  | 'audit.view'
  | 'settings.view'
  | 'settings.edit'
  | 'data.export';

// Permission matrix for actions
const actionPermissions: Record<ActionType, Role[]> = {
  // Project actions
  'project.create': ['admin', 'manager'],
  'project.edit': ['admin', 'manager'],
  'project.delete': ['admin'],
  'project.archive': ['admin', 'manager'],
  'project.view': ['admin', 'manager', 'viewer'],

  // User actions
  'user.invite': ['admin'],
  'user.changeRole': ['admin'],
  'user.deactivate': ['admin'],
  'user.view': ['admin'],

  // Admin actions
  'billing.view': ['admin'],
  'billing.edit': ['admin'],
  'audit.view': ['admin'],
  'settings.view': ['admin', 'manager'],
  'settings.edit': ['admin'],
  'data.export': ['admin', 'manager'],
};

/**
 * Check if a role can perform a specific action
 */
export function canPerformAction(role: Role, action: ActionType): boolean {
  const allowedRoles = actionPermissions[action];
  return allowedRoles?.includes(role) ?? false;
}

/**
 * Error thrown when permission is denied
 */
export class PermissionDeniedError extends Error {
  constructor(action: ActionType, role: Role) {
    super(`Permission denied: ${role} cannot perform ${action}`);
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Enforce a permission check - throws if denied
 */
export function enforcePermission(role: Role, action: ActionType): void {
  if (!canPerformAction(role, action)) {
    throw new PermissionDeniedError(action, role);
  }
}

/**
 * Get human-readable message for permission denial
 */
export function getPermissionDeniedMessage(action: ActionType): string {
  const messages: Partial<Record<ActionType, string>> = {
    'project.create': 'You do not have permission to create projects.',
    'project.edit': 'You do not have permission to edit projects.',
    'project.delete': 'Only administrators can delete projects.',
    'project.archive': 'You do not have permission to archive projects.',
    'user.invite': 'Only administrators can invite users.',
    'user.changeRole': 'Only administrators can change user roles.',
    'user.deactivate': 'Only administrators can deactivate users.',
    'billing.view': 'Only administrators can view billing.',
    'audit.view': 'Only administrators can view audit logs.',
    'settings.edit': 'Only administrators can edit organization settings.',
    'data.export': 'You do not have permission to export data.',
  };
  return messages[action] || 'You do not have permission to perform this action.';
}
