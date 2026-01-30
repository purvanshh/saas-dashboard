/**
 * RBAC (Role-Based Access Control) Middleware
 * 
 * This is the THIRD middleware in the chain.
 * AFTER authentication and tenant resolution, this enforces permissions.
 * 
 * Usage:
 * router.post('/projects', 
 *   authenticateUser,           // Step 1: Who are you?
 *   resolveTenantContext,       // Step 2: Where are you?
 *   requirePermission('project:create'),  // Step 3: What can you do?
 *   createProjectHandler
 * );
 * 
 * Security principles:
 * 1. Permissions are enforced server-side, never trust frontend
 * 2. Each route declares its required permission explicitly
 * 3. Permission denied responses are clear but don't leak info
 * 4. Audit log is written on permission failures (optional)
 */

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ResourceAction } from '../types';

/**
 * Factory function that creates permission-checking middleware
 * 
 * @param requiredPermission - The permission required in "resource:action" format
 * @returns Express middleware that blocks unauthorized requests
 * 
 * Example:
 * requirePermission('project:delete') - Only admins can delete
 * requirePermission('project:update') - Admins and Managers can update
 * requirePermission('project:view')   - Everyone can view
 */
export function requirePermission(requiredPermission: ResourceAction) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Ensure tenant context is resolved (middleware ordering check)
    if (!req.tenantContext) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Permission check failed: Tenant context not resolved.',
          status: 500,
        },
      });
      return;
    }

    const { role, permissions } = req.tenantContext;

    // Check if user has the required permission
    const hasPermission = permissions.some(
      p => `${p.resource}:${p.action}` === requiredPermission
    );

    if (!hasPermission) {
      // Log permission denial for audit trail (optional but recommended)
      console.warn(`Permission denied: User ${req.user.id} (role: ${role}) attempted ${requiredPermission} in tenant ${req.tenantContext.tenantId}`);

      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `You don't have permission to perform this action. Required: ${requiredPermission}. Your role: ${role}.`,
          status: 403,
          details: {
            requiredPermission,
            currentRole: role,
          },
        },
      });
      return;
    }

    // Permission granted - proceed to route handler
    next();
  };
}

/**
 * Require any of the specified permissions
 * Useful when multiple roles can perform an action with different permissions
 * 
 * Example:
 * requireAnyPermission(['project:update', 'project:admin'])
 */
export function requireAnyPermission(requiredPermissions: ResourceAction[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.tenantContext) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Permission check failed: Tenant context not resolved.',
          status: 500,
        },
      });
      return;
    }

    const { role, permissions } = req.tenantContext;

    const hasAnyPermission = requiredPermissions.some(required =>
      permissions.some(p => `${p.resource}:${p.action}` === required)
    );

    if (!hasAnyPermission) {
      console.warn(`Permission denied: User ${req.user.id} (role: ${role}) attempted action requiring any of [${requiredPermissions.join(', ')}]`);

      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `You don't have permission to perform this action.`,
          status: 403,
          details: {
            requiredPermissions,
            currentRole: role,
          },
        },
      });
      return;
    }

    next();
  };
}

/**
 * Require all of the specified permissions
 * Useful for high-sensitivity operations
 * 
 * Example:
 * requireAllPermissions(['org:delete', 'org:billing'])
 * (Must have both billing access AND delete permission to delete org)
 */
export function requireAllPermissions(requiredPermissions: ResourceAction[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.tenantContext) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Permission check failed: Tenant context not resolved.',
          status: 500,
        },
      });
      return;
    }

    const { role, permissions } = req.tenantContext;

    const userPermissionStrings = permissions.map(p => `${p.resource}:${p.action}`);
    const missingPermissions = requiredPermissions.filter(
      required => !userPermissionStrings.includes(required)
    );

    if (missingPermissions.length > 0) {
      console.warn(`Permission denied: User ${req.user.id} (role: ${role}) missing permissions [${missingPermissions.join(', ')}]`);

      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `You don't have all required permissions.`,
          status: 403,
          details: {
            missingPermissions,
            currentRole: role,
          },
        },
      });
      return;
    }

    next();
  };
}

/**
 * Require specific role(s)
 * Simpler than permission checking for broad restrictions
 * 
 * Example:
 * requireRole('admin') - Admin only
 * requireRole(['admin', 'manager']) - Admin or Manager
 */
export function requireRole(allowedRoles: string | string[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.tenantContext) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Role check failed: Tenant context not resolved.',
          status: 500,
        },
      });
      return;
    }

    const { role } = req.tenantContext;

    if (!roles.includes(role)) {
      console.warn(`Role denied: User ${req.user.id} (role: ${role}) attempted action requiring role(s) [${roles.join(', ')}]`);

      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `This action requires ${roles.length === 1 ? roles[0] : 'one of: ' + roles.join(', ')} role.`,
          status: 403,
          details: {
            requiredRoles: roles,
            currentRole: role,
          },
        },
      });
      return;
    }

    next();
  };
}

/**
 * Helper to check if current user has a specific permission
 * Use this inside route handlers for conditional logic
 * 
 * Example:
 * if (hasPermission(req, 'project:delete')) {
 *   // Show delete button in response
 * }
 */
export function hasPermission(
  req: AuthenticatedRequest, 
  permission: ResourceAction
): boolean {
  if (!req.tenantContext) return false;
  
  return req.tenantContext.permissions.some(
    p => `${p.resource}:${p.action}` === permission
  );
}

/**
 * Get user's permissions as a formatted object (matches frontend PermissionCheck)
 * Useful for /me endpoint to tell frontend what user can do
 */
export function getPermissionCheck(req: AuthenticatedRequest) {
  if (!req.tenantContext) {
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      canManageOrg: false,
      canViewBilling: false,
      canViewAuditLogs: false,
    };
  }

  const perms = req.tenantContext.permissions.map(p => `${p.resource}:${p.action}`);

  return {
    canView: perms.includes('project:view'),
    canCreate: perms.includes('project:create'),
    canEdit: perms.includes('project:update'),
    canDelete: perms.includes('project:delete'),
    canManageUsers: perms.includes('user:invite'),
    canManageOrg: perms.includes('org:update'),
    canViewBilling: perms.includes('org:billing'),
    canViewAuditLogs: perms.includes('audit:view'),
  };
}
