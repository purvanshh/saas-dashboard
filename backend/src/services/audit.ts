/**
 * Audit Logging Service
 * 
 * Automatically logs all significant actions for compliance and debugging.
 * This is critical for enterprise SaaS - every create, update, delete must be tracked.
 * 
 * Principles:
 * 1. Logs are append-only (never deleted or modified)
 * 2. Include who, what, when, and before/after state
 * 3. Capture metadata like IP and user agent for security
 * 4. Don't block the request on logging failure (but log the error)
 */

import { Request } from 'express';
import { supabase } from '../db/client';
import { AuthenticatedRequest, AuditableAction, AuditLog } from '../types';

export interface AuditLogInput {
  action: AuditableAction;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Write an audit log entry
 * 
 * This should be called after successful operations to record what happened.
 * Non-blocking - errors are logged but don't fail the request.
 */
export async function writeAuditLog(
  req: AuthenticatedRequest,
  input: AuditLogInput
): Promise<void> {
  try {
    const { tenantContext, user } = req;
    
    if (!tenantContext) {
      console.warn('Cannot write audit log: No tenant context');
      return;
    }

    // Get request metadata
    const ipAddress = req.ip || req.connection.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const auditEntry = {
      tenant_id: tenantContext.tenantId,
      actor_user_id: user.id,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId || null,
      resource_name: input.resourceName || null,
      previous_state: input.previousState || null,
      new_state: input.newState || null,
      metadata: {
        ...input.metadata,
        userRole: tenantContext.role,
        timestamp: new Date().toISOString(),
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    // Insert audit log (fire and forget - don't await)
    const { error } = await supabase
      .from('audit_logs')
      .insert(auditEntry);

    if (error) {
      console.error('Failed to write audit log:', error);
      // Don't throw - we don't want to fail the request because logging failed
    }
  } catch (error) {
    console.error('Audit logging error:', error);
    // Silent fail - logging failures shouldn't break the application
  }
}

/**
 * Write audit log with await
 * Use this only when you absolutely need to confirm logging succeeded
 * (e.g., before destructive operations)
 */
export async function writeAuditLogSync(
  req: AuthenticatedRequest,
  input: AuditLogInput
): Promise<boolean> {
  try {
    const { tenantContext, user } = req;
    
    if (!tenantContext) {
      console.warn('Cannot write audit log: No tenant context');
      return false;
    }

    const ipAddress = req.ip || req.connection.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const auditEntry = {
      tenant_id: tenantContext.tenantId,
      actor_user_id: user.id,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId || null,
      resource_name: input.resourceName || null,
      previous_state: input.previousState || null,
      new_state: input.newState || null,
      metadata: {
        ...input.metadata,
        userRole: tenantContext.role,
        timestamp: new Date().toISOString(),
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert(auditEntry);

    if (error) {
      console.error('Failed to write audit log:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Audit logging error:', error);
    return false;
  }
}

/**
 * Fetch audit logs for a tenant
 * Only admins should be able to access this
 */
export async function getAuditLogs(
  tenantId: string,
  options: {
    limit?: number;
    offset?: number;
    resourceType?: string;
    actorId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
): Promise<{ logs: AuditLog[]; total: number }> {
  const {
    limit = 50,
    offset = 0,
    resourceType,
    actorId,
    startDate,
    endDate,
  } = options;

  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }

  if (actorId) {
    query = query.eq('actor_user_id', actorId);
  }

  if (startDate) {
    query = query.gte('created_at', startDate.toISOString());
  }

  if (endDate) {
    query = query.lte('created_at', endDate.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Failed to fetch audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }

  const logs: AuditLog[] = (data || []).map(row => ({
    id: row.id,
    tenantId: row.tenant_id,
    actorUserId: row.actor_user_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id || undefined,
    resourceName: row.resource_name || undefined,
    previousState: row.previous_state || undefined,
    newState: row.new_state || undefined,
    metadata: row.metadata,
    ipAddress: row.ip_address || undefined,
    userAgent: row.user_agent || undefined,
    createdAt: new Date(row.created_at),
  }));

  return {
    logs,
    total: count || 0,
  };
}

/**
 * Convenience wrapper for logging project operations
 */
export function logProjectAction(
  req: AuthenticatedRequest,
  action: 'project.create' | 'project.update' | 'project.delete' | 'project.archive',
  projectId: string,
  projectName: string,
  previousState?: Record<string, unknown>,
  newState?: Record<string, unknown>
): void {
  // Fire and forget
  writeAuditLog(req, {
    action,
    resourceType: 'project',
    resourceId: projectId,
    resourceName: projectName,
    previousState,
    newState,
  }).catch(console.error);
}

/**
 * Convenience wrapper for logging user management operations
 */
export function logUserAction(
  req: AuthenticatedRequest,
  action: 'user.invite' | 'user.role_change' | 'user.remove',
  targetUserId: string,
  targetUserEmail: string,
  previousState?: Record<string, unknown>,
  newState?: Record<string, unknown>
): void {
  writeAuditLog(req, {
    action,
    resourceType: 'user',
    resourceId: targetUserId,
    resourceName: targetUserEmail,
    previousState,
    newState,
  }).catch(console.error);
}

/**
 * Convenience wrapper for logging organization operations
 */
export function logOrgAction(
  req: AuthenticatedRequest,
  action: 'org.settings_update' | 'org.billing_update',
  previousState?: Record<string, unknown>,
  newState?: Record<string, unknown>
): void {
  writeAuditLog(req, {
    action,
    resourceType: 'organization',
    resourceId: req.tenantContext?.tenantId,
    resourceName: req.tenantContext?.tenant.name,
    previousState,
    newState,
  }).catch(console.error);
}
