/**
 * Tenant Context Resolution Middleware
 * 
 * AFTER authentication, this middleware determines:
 * 1. Which tenant the user is accessing
 * 2. What role the user has in that tenant
 * 3. What permissions that role grants
 * 
 * This is the SECOND middleware in the chain.
 * 
 * Security principles:
 * 1. Never trust client-provided tenant_id
 * 2. Always resolve tenant from user's active memberships
 * 3. Default to user's primary/only organization if not specified
 * 4. Enforce that user is an active member of the tenant
 */

import { Response, NextFunction } from 'express';
import { supabase } from '../db/client';
import { AuthenticatedRequest, TenantContext, Tenant, Role, Permission } from '../types';

// Header or query param for explicit tenant selection
const TENANT_ID_HEADER = 'x-tenant-id';

/**
 * Resolves tenant context for the authenticated user
 * 
 * Priority:
 * 1. Explicit tenant_id from header (for organization switching)
 * 2. User's active tenant memberships (if only one, use it)
 * 3. Error if user belongs to multiple but none specified
 */
export async function resolveTenantContext(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user.id;
    
    // Check for explicit tenant selection via header
    const explicitTenantId = req.headers[TENANT_ID_HEADER.toLowerCase()] as string ||
                            req.headers[TENANT_ID_HEADER] as string;

    // Fetch user's active tenant memberships
    const { data: memberships, error: membershipError } = await supabase
      .from('tenant_users')
      .select(`
        id,
        tenant_id,
        user_id,
        role,
        joined_at,
        invited_by,
        is_active,
        tenants:tenant_id (
          id,
          name,
          slug,
          plan,
          settings,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .is('deleted_at', null);

    if (membershipError) {
      console.error('Tenant membership lookup failed:', membershipError);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to resolve organization context.',
          status: 500,
        },
      });
      return;
    }

    if (!memberships || memberships.length === 0) {
      res.status(403).json({
        error: {
          code: 'TENANT_NOT_FOUND',
          message: 'You are not a member of any organization.',
          status: 403,
        },
      });
      return;
    }

    // Determine which tenant to use
    let selectedMembership;

    if (explicitTenantId) {
      // User explicitly selected a tenant
      selectedMembership = memberships.find(m => m.tenant_id === explicitTenantId);
      
      if (!selectedMembership) {
        res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to the specified organization.',
            status: 403,
          },
        });
        return;
      }
    } else if (memberships.length === 1) {
      // User belongs to exactly one tenant - use it
      selectedMembership = memberships[0];
    } else {
      // User belongs to multiple tenants but didn't specify which
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Multiple organizations available. Please specify which organization to access.',
          details: {
            organizations: memberships.map(m => ({
              id: m.tenant_id,
              name: (m as unknown as { tenants: { name: string } }).tenants.name,
            })),
          },
          status: 400,
        },
      });
      return;
    }

    // Fetch permissions for this role
    const { data: permissions, error: permError } = await supabase
      .from('role_permissions')
      .select(`
        permissions:permission_id (
          id,
          resource,
          action,
          description
        )
      `)
      .eq('role', selectedMembership.role);

    if (permError) {
      console.error('Permission lookup failed:', permError);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to resolve permissions.',
          status: 500,
        },
      });
      return;
    }

    // Extract tenant data from joined query
    const tenantData = (selectedMembership as unknown as { 
      tenants: { 
        id: string;
        name: string;
        slug: string;
        plan: string;
        settings: Record<string, unknown>;
        created_at: string;
        updated_at: string;
      } 
    }).tenants;

    const tenant: Tenant = {
      id: tenantData.id,
      name: tenantData.name,
      slug: tenantData.slug,
      plan: tenantData.plan as 'starter' | 'professional' | 'enterprise',
      settings: tenantData.settings,
      createdAt: new Date(tenantData.created_at),
      updatedAt: new Date(tenantData.updated_at),
    };

    const permissionList: Permission[] = (permissions || []).map(p => {
      const perm = (p as unknown as { permissions: Permission }).permissions;
      return {
        id: perm.id,
        resource: perm.resource,
        action: perm.action,
        description: perm.description,
      };
    });

    // Build tenant context
    const tenantContext: TenantContext = {
      tenantId: selectedMembership.tenant_id,
      tenant,
      membership: {
        id: selectedMembership.id,
        tenantId: selectedMembership.tenant_id,
        userId: selectedMembership.user_id,
        role: selectedMembership.role as Role,
        joinedAt: new Date(selectedMembership.joined_at),
        invitedBy: selectedMembership.invited_by || undefined,
        isActive: selectedMembership.is_active,
      },
      role: selectedMembership.role as Role,
      permissions: permissionList,
    };

    // Attach tenant context to request
    req.tenantContext = tenantContext;

    next();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Organization resolution failed.',
        status: 500,
      },
    });
  }
}

/**
 * Switch organization endpoint helper
 * Used when user explicitly wants to switch to a different tenant
 */
export async function switchOrganization(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user.id;
    const { organizationId } = req.body;

    if (!organizationId) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'organizationId is required.',
          status: 400,
        },
      });
      return;
    }

    // Verify user has access to this organization
    const { data: membership, error } = await supabase
      .from('tenant_users')
      .select(`
        *,
        tenants:tenant_id (*)
      `)
      .eq('user_id', userId)
      .eq('tenant_id', organizationId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .single();

    if (error || !membership) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this organization.',
          status: 403,
        },
      });
      return;
    }

    // Fetch permissions for new tenant context
    const { data: permissions } = await supabase
      .from('role_permissions')
      .select(`
        permissions:permission_id (*)
      `)
      .eq('role', membership.role);

    const tenantData = (membership as unknown as { tenants: Tenant }).tenants;

    res.json({
      organization: tenantData,
      role: membership.role,
      permissions: (permissions || []).map(p => 
        (p as unknown as { permissions: Permission }).permissions
      ),
    });
  } catch (error) {
    console.error('Switch organization error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to switch organization.',
        status: 500,
      },
    });
  }
}
