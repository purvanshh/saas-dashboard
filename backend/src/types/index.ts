/**
 * Core TypeScript types for the multi-tenant SaaS backend
 * These types match the frontend UI components exactly
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type Role = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  authId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    authId: string;
    email: string;
  };
  tenantContext?: TenantContext;
}

// ============================================
// TENANT TYPES
// ============================================

export type Plan = 'starter' | 'professional' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantMembership {
  id: string;
  tenantId: string;
  userId: string;
  role: Role;
  joinedAt: Date;
  invitedBy?: string;
  isActive: boolean;
}

export interface TenantContext {
  tenantId: string;
  tenant: Tenant;
  membership: TenantMembership;
  role: Role;
  permissions: Permission[];
}

// ============================================
// RBAC TYPES
// ============================================

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export type ResourceAction = 
  | 'project:view'
  | 'project:create'
  | 'project:update'
  | 'project:delete'
  | 'project:archive'
  | 'user:view'
  | 'user:invite'
  | 'user:update_role'
  | 'user:remove'
  | 'org:view'
  | 'org:update'
  | 'org:delete'
  | 'org:billing'
  | 'audit:view'
  | 'audit:export';

// Permission matrix for frontend display (matches UI)
export interface PermissionCheck {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canManageOrg: boolean;
  canViewBilling: boolean;
  canViewAuditLogs: boolean;
}

// ============================================
// PROJECT TYPES (matches UI)
// ============================================

export type ProjectStatus = 'active' | 'archived' | 'deleted';

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// ============================================
// AUDIT LOG TYPES
// ============================================

export interface AuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Audit log actions that trigger auto-logging
export type AuditableAction = 
  | 'project.create'
  | 'project.update'
  | 'project.delete'
  | 'project.archive'
  | 'user.invite'
  | 'user.role_change'
  | 'user.remove'
  | 'org.settings_update'
  | 'org.billing_update';

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

// Auth routes
export interface MeResponse {
  user: User;
  organizations: Tenant[];
  currentOrganization: Tenant;
  role: Role;
  permissions: PermissionCheck;
}

// Organization routes
export interface SwitchOrganizationInput {
  organizationId: string;
}

export interface SwitchOrganizationResponse {
  organization: Tenant;
  role: Role;
  permissions: PermissionCheck;
}

// User routes (Admin-only)
export interface InviteUserInput {
  email: string;
  role: Role;
}

export interface UpdateUserRoleInput {
  userId: string;
  role: Role;
}

export interface ListUsersResponse {
  users: Array<{
    id: string;
    email: string;
    name: string;
    role: Role;
    joinedAt: Date;
    invitedBy?: string;
  }>;
}

// Project routes
export interface ListProjectsResponse {
  projects: Project[];
}

export interface CreateProjectResponse {
  project: Project;
}

export interface UpdateProjectResponse {
  project: Project;
}

export interface DeleteProjectResponse {
  success: boolean;
  message: string;
}

// Audit log routes
export interface ListAuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  status: number;
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'TENANT_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'PROJECT_NOT_FOUND'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR';

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

// These map to the SQL schema
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          settings: Record<string, unknown>;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      tenant_users: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          invited_by: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          status: string;
          created_by: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          tenant_id: string;
          actor_user_id: string;
          action: string;
          resource_type: string;
          resource_id: string | null;
          resource_name: string | null;
          previous_state: Record<string, unknown> | null;
          new_state: Record<string, unknown> | null;
          metadata: Record<string, unknown>;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
      };
    };
  };
}
