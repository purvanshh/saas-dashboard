-- Multi-Tenant SaaS Database Schema
-- Enforces tenant isolation, RBAC, and audit logging at the database level
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Tenants (Organizations)
-- Every piece of business data belongs to exactly one tenant
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Users (linked to Supabase Auth)
-- User identity is global, but membership is tenant-scoped
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Tenant Memberships (Many-to-Many with Role)
-- This is the critical table for tenant isolation and RBAC
-- A user can belong to multiple tenants with different roles
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Enforce one membership per user per tenant
    UNIQUE(tenant_id, user_id)
);

-- ============================================
-- RBAC TABLES
-- ============================================

-- Permissions (Resource:Action format)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- Role Permissions (Many-to-Many)
-- Defines what each role can do
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'viewer')),
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, permission_id)
);

-- ============================================
-- BUSINESS TABLES (Tenant-Scoped)
-- ============================================

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- ============================================
-- AUDIT LOGGING (Immutable)
-- ============================================

-- Audit Logs (Append-Only)
-- Records every significant action for compliance and debugging
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    resource_name VARCHAR(255),
    previous_state JSONB,
    new_state JSONB,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDICES (Performance Critical for Multi-Tenancy)
-- ============================================

-- Tenant isolation indices
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON tenant_users(user_id);
CREATE INDEX idx_tenant_users_role ON tenant_users(tenant_id, role);

-- Business table tenant isolation
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_projects_tenant_status ON projects(tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Audit log indices
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Soft delete handling
CREATE INDEX idx_tenants_not_deleted ON tenants(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_not_deleted ON users(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenant_users_active ON tenant_users(tenant_id, user_id) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_projects_not_deleted ON projects(tenant_id) WHERE deleted_at IS NULL;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default permissions
INSERT INTO permissions (resource, action, description) VALUES
-- Project permissions
('project', 'view', 'View projects within tenant'),
('project', 'create', 'Create new projects'),
('project', 'update', 'Update existing projects'),
('project', 'delete', 'Delete projects (soft delete)'),
('project', 'archive', 'Archive projects'),
-- User management permissions
('user', 'view', 'View tenant users'),
('user', 'invite', 'Invite users to tenant'),
('user', 'update_role', 'Change user roles'),
('user', 'remove', 'Remove users from tenant'),
-- Organization permissions
('org', 'view', 'View organization settings'),
('org', 'update', 'Update organization settings'),
('org', 'delete', 'Delete organization'),
('org', 'billing', 'View and manage billing'),
-- Audit permissions
('audit', 'view', 'View audit logs'),
('audit', 'export', 'Export audit logs');

-- Assign permissions to roles
-- Admin gets everything
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions;

-- Manager gets project management and user viewing
INSERT INTO role_permissions (role, permission_id)
SELECT 'manager', id FROM permissions 
WHERE resource = 'project' 
   OR (resource = 'user' AND action = 'view')
   OR (resource = 'org' AND action IN ('view', 'billing'));

-- Viewer gets read-only access
INSERT INTO role_permissions (role, permission_id)
SELECT 'viewer', id FROM permissions 
WHERE action = 'view';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
-- Users can only see projects in their tenant
CREATE POLICY tenant_isolation_projects ON projects
    USING (tenant_id IN (
        SELECT tenant_id FROM tenant_users 
        WHERE user_id = auth.uid()::uuid 
        AND is_active = true 
        AND deleted_at IS NULL
    ));

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at BEFORE UPDATE ON tenant_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (for easier querying)
-- ============================================

-- Active tenant members with role details
CREATE VIEW tenant_members AS
SELECT 
    tu.id as membership_id,
    tu.tenant_id,
    t.name as tenant_name,
    tu.user_id,
    u.email,
    u.name as user_name,
    u.avatar_url,
    tu.role,
    tu.joined_at,
    tu.is_active,
    tu.invited_by,
    inviter.name as invited_by_name
FROM tenant_users tu
JOIN tenants t ON tu.tenant_id = t.id
JOIN users u ON tu.user_id = u.id
LEFT JOIN users inviter ON tu.invited_by = inviter.id
WHERE tu.deleted_at IS NULL 
  AND t.deleted_at IS NULL
  AND tu.is_active = true;

-- User permissions view (flattened for easy middleware use)
CREATE VIEW user_permissions AS
SELECT 
    tu.user_id,
    tu.tenant_id,
    tu.role,
    p.resource,
    p.action,
    p.id as permission_id
FROM tenant_users tu
JOIN role_permissions rp ON tu.role = rp.role
JOIN permissions p ON rp.permission_id = p.id
WHERE tu.is_active = true AND tu.deleted_at IS NULL;

-- ============================================
-- SAMPLE DATA (for development/testing)
-- ============================================

-- Sample tenants
INSERT INTO tenants (id, name, slug, plan) VALUES
('org_1', 'Acme Corporation', 'acme-corp', 'enterprise'),
('org_2', 'TechStart Inc', 'techstart', 'professional'),
('org_3', 'Global Dynamics', 'global-dynamics', 'enterprise');

-- Note: Users would be created via Supabase Auth, then linked here
-- The auth_id would come from Supabase auth.users table

COMMIT;
