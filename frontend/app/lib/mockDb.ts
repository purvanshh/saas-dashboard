'use client';

/**
 * Mock Database Layer
 * Centralized store with localStorage persistence for realistic SaaS behavior.
 * All state mutations go through this layer.
 */

import { Role } from './permissions';

// ============================================
// TYPES
// ============================================

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    plan: 'starter' | 'professional' | 'enterprise';
    memberCount: number;
    isNew?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: Role;
    organizationId: string;
    isActive: boolean;
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'completed';
    lastUpdated: string;
    memberCount: number;
    organizationId: string;
    createdAt: string;
    createdBy: string;
}

export interface AuditLogEntry {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    action: string;
    target: string;
    timestamp: string;
    organizationId: string;
    createdAt: number; // Unix timestamp for sorting
}

export interface Membership {
    userId: string;
    organizationId: string;
    role: Role;
}

export interface MockStore {
    organizations: Organization[];
    users: User[];
    projects: Project[];
    auditLogs: AuditLogEntry[];
    memberships: Membership[];
    _version: number;
}

// ============================================
// STORAGE KEY
// ============================================

const STORAGE_KEY = 'saas_dashboard_mock_db';

// ============================================
// SEED DATA
// ============================================

const seedOrganizations: Organization[] = [
    { id: 'org_1', name: 'Acme Corporation', slug: 'acme-corp', plan: 'enterprise', memberCount: 142 },
    { id: 'org_2', name: 'TechStart Inc', slug: 'techstart', plan: 'professional', memberCount: 28 },
    { id: 'org_3', name: 'Global Dynamics', slug: 'global-dynamics', plan: 'enterprise', memberCount: 89 },
    { id: 'org_new', name: 'NewCo Labs', slug: 'newco-labs', plan: 'starter', memberCount: 1, isNew: true },
];

const seedUsers: User[] = [
    // Org 1: Acme Corp
    { id: 'user_1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', organizationId: 'org_1', isActive: true, createdAt: '2025-01-01' },
    { id: 'user_2', name: 'Michael Torres', email: 'michael@acme.com', role: 'manager', organizationId: 'org_1', isActive: true, createdAt: '2025-01-15' },
    { id: 'user_3', name: 'Emily Watson', email: 'emily@acme.com', role: 'viewer', organizationId: 'org_1', isActive: true, createdAt: '2025-02-01' },

    // Org 2: TechStart Inc (Startup vibe)
    { id: 'user_4', name: 'Alex Kim', email: 'alex@techstart.io', role: 'admin', organizationId: 'org_2', isActive: true, createdAt: '2025-01-10' },
    { id: 'user_5', name: 'Jordan Lee', email: 'jordan@techstart.io', role: 'manager', organizationId: 'org_2', isActive: true, createdAt: '2025-01-20' },
    { id: 'user_6', name: 'Casey Smith', email: 'casey@techstart.io', role: 'viewer', organizationId: 'org_2', isActive: true, createdAt: '2025-02-05' },
    { id: 'user_10', name: 'Sam Rivera', email: 'sam@techstart.io', role: 'manager', organizationId: 'org_2', isActive: true, createdAt: '2025-02-06' },
    { id: 'user_11', name: 'Taylor Otwell', email: 'taylor@techstart.io', role: 'viewer', organizationId: 'org_2', isActive: true, createdAt: '2025-02-07' },

    // Org 3: Global Dynamics (Enterprise vibe)
    { id: 'user_7', name: 'Robert Fox', email: 'robert.fox@globaldynamics.com', role: 'admin', organizationId: 'org_3', isActive: true, createdAt: '2024-11-15' },
    { id: 'user_8', name: 'Maria Garcia', email: 'm.garcia@globaldynamics.com', role: 'manager', organizationId: 'org_3', isActive: true, createdAt: '2024-12-01' },
    { id: 'user_9', name: 'David Wong', email: 'd.wong@globaldynamics.com', role: 'viewer', organizationId: 'org_3', isActive: true, createdAt: '2025-01-12' },
    { id: 'user_12', name: 'James Wilson', email: 'j.wilson@globaldynamics.com', role: 'viewer', organizationId: 'org_3', isActive: false, createdAt: '2024-12-10' },
    { id: 'user_13', name: 'Linda Chen', email: 'l.chen@globaldynamics.com', role: 'manager', organizationId: 'org_3', isActive: true, createdAt: '2025-01-20' },
];

const seedProjects: Project[] = [
    // Org 1: Acme Corp
    { id: 'proj_1', name: 'Website Redesign', description: 'Overhaul of the main marketing site', status: 'active', lastUpdated: '2 hours ago', memberCount: 5, organizationId: 'org_1', createdAt: '2025-01-10', createdBy: 'user_1' },
    { id: 'proj_2', name: 'Mobile App Beta', description: 'iOS and Android beta testing phase', status: 'active', lastUpdated: '1 day ago', memberCount: 8, organizationId: 'org_1', createdAt: '2025-01-15', createdBy: 'user_2' },
    { id: 'proj_3', name: 'Legacy Migration', description: 'Moving from V1 to V2 infrastructure', status: 'completed', lastUpdated: '1 month ago', memberCount: 3, organizationId: 'org_1', createdAt: '2024-12-01', createdBy: 'user_1' },

    // Org 2: TechStart Inc
    { id: 'proj_4', name: 'API Gateway', description: 'Centralized API management system', status: 'active', lastUpdated: '3 hours ago', memberCount: 4, organizationId: 'org_2', createdAt: '2025-01-20', createdBy: 'user_4' },
    { id: 'proj_5', name: 'Customer Dashboard', description: 'New analytics view for customers', status: 'active', lastUpdated: '5 hours ago', memberCount: 6, organizationId: 'org_2', createdAt: '2025-02-01', createdBy: 'user_5' },
    { id: 'proj_6', name: 'Internal Tools', description: 'Admin panel updates', status: 'archived', lastUpdated: '2 weeks ago', memberCount: 2, organizationId: 'org_2', createdAt: '2024-12-15', createdBy: 'user_4' },
    { id: 'proj_9', name: 'AI Integration', description: 'Integrating LLM features into core product', status: 'active', lastUpdated: '10 min ago', memberCount: 5, organizationId: 'org_2', createdAt: '2025-02-10', createdBy: 'user_4' },
    { id: 'proj_10', name: 'Growth Experiments', description: 'A/B testing framework setup', status: 'completed', lastUpdated: '1 week ago', memberCount: 3, organizationId: 'org_2', createdAt: '2025-01-05', createdBy: 'user_5' },

    // Org 3: Global Dynamics
    { id: 'proj_7', name: 'Cloud Migration', description: 'Moving on-premise servers to AWS', status: 'active', lastUpdated: '10 min ago', memberCount: 12, organizationId: 'org_3', createdAt: '2024-11-20', createdBy: 'user_7' },
    { id: 'proj_8', name: 'Security Audit', description: 'Q1 Security compliance check', status: 'completed', lastUpdated: '3 days ago', memberCount: 5, organizationId: 'org_3', createdAt: '2025-01-05', createdBy: 'user_8' },
    { id: 'proj_11', name: 'Enterprise ERP', description: 'Implementation of new ERP system', status: 'active', lastUpdated: '1 hour ago', memberCount: 25, organizationId: 'org_3', createdAt: '2024-10-15', createdBy: 'user_7' },
    { id: 'proj_12', name: 'Data Warehouse', description: 'Snowflake integration project', status: 'active', lastUpdated: '4 hours ago', memberCount: 8, organizationId: 'org_3', createdAt: '2024-12-01', createdBy: 'user_13' },
    { id: 'proj_13', name: 'GDPR Compliance', description: 'EU data protection updates', status: 'completed', lastUpdated: '1 month ago', memberCount: 4, organizationId: 'org_3', createdAt: '2024-11-01', createdBy: 'user_8' },
];

const seedAuditLogs: AuditLogEntry[] = [
    { id: 'log_1', userId: 'user_1', userName: 'Sarah Chen', action: 'invited', target: 'james@acme.com', timestamp: '2 min ago', organizationId: 'org_1', createdAt: Date.now() - 120000 },
    { id: 'log_2', userId: 'user_2', userName: 'Michael Torres', action: 'updated', target: 'Project Alpha settings', timestamp: '15 min ago', organizationId: 'org_1', createdAt: Date.now() - 900000 },
    { id: 'log_3', userId: 'user_1', userName: 'Sarah Chen', action: 'changed role of', target: 'Emily Watson to Manager', timestamp: '1 hour ago', organizationId: 'org_1', createdAt: Date.now() - 3600000 },

    // Org 2 Logs
    { id: 'log_4', userId: 'user_4', userName: 'Alex Kim', action: 'created project', target: 'Customer Dashboard', timestamp: '5 hours ago', organizationId: 'org_2', createdAt: Date.now() - 18000000 },
    { id: 'log_5', userId: 'user_5', userName: 'Jordan Lee', action: 'invited', target: 'casey@techstart.io', timestamp: '1 day ago', organizationId: 'org_2', createdAt: Date.now() - 86400000 },
    { id: 'log_7', userId: 'user_4', userName: 'Alex Kim', action: 'updated', target: 'API Gateway specs', timestamp: '2 days ago', organizationId: 'org_2', createdAt: Date.now() - 172800000 },
    { id: 'log_8', userId: 'user_10', userName: 'Sam Rivera', action: 'archived', target: 'Internal Tools', timestamp: '3 days ago', organizationId: 'org_2', createdAt: Date.now() - 259200000 },

    // Org 3 Logs
    { id: 'log_6', userId: 'user_7', userName: 'Robert Fox', action: 'deleted project', target: 'Old Legacy App', timestamp: '2 days ago', organizationId: 'org_3', createdAt: Date.now() - 172800000 },
    { id: 'log_9', userId: 'user_8', userName: 'Maria Garcia', action: 'invited', target: 'j.wilson@globaldynamics.com', timestamp: '1 week ago', organizationId: 'org_3', createdAt: Date.now() - 604800000 },
    { id: 'log_10', userId: 'user_7', userName: 'Robert Fox', action: 'deactivated', target: 'James Wilson', timestamp: '1 day ago', organizationId: 'org_3', createdAt: Date.now() - 86400000 },
    { id: 'log_11', userId: 'user_13', userName: 'Linda Chen', action: 'created project', target: 'Data Warehouse', timestamp: '4 hours ago', organizationId: 'org_3', createdAt: Date.now() - 14400000 },
];

const seedMemberships: Membership[] = [
    // Org 1
    { userId: 'user_1', organizationId: 'org_1', role: 'admin' },
    { userId: 'user_2', organizationId: 'org_1', role: 'manager' },
    { userId: 'user_3', organizationId: 'org_1', role: 'viewer' },

    // Org 2
    { userId: 'user_4', organizationId: 'org_2', role: 'admin' },
    { userId: 'user_5', organizationId: 'org_2', role: 'manager' },
    { userId: 'user_6', organizationId: 'org_2', role: 'viewer' },
    { userId: 'user_10', organizationId: 'org_2', role: 'manager' },
    { userId: 'user_11', organizationId: 'org_2', role: 'viewer' },

    // Org 3
    { userId: 'user_7', organizationId: 'org_3', role: 'admin' },
    { userId: 'user_8', organizationId: 'org_3', role: 'manager' },
    { userId: 'user_9', organizationId: 'org_3', role: 'viewer' },
    { userId: 'user_12', organizationId: 'org_3', role: 'viewer' },
    { userId: 'user_13', organizationId: 'org_3', role: 'manager' },

    // Cross-org
    { userId: 'user_1', organizationId: 'org_2', role: 'viewer' }, // Sarah viewers TechStart
];

// ============================================
// IN-MEMORY STORE
// ============================================

let store: MockStore | null = null;

function getDefaultStore(): MockStore {
    return {
        organizations: [...seedOrganizations],
        users: [...seedUsers],
        projects: [...seedProjects],
        auditLogs: [...seedAuditLogs],
        memberships: [...seedMemberships],
        _version: 1,
    };
}

// ============================================
// PERSISTENCE
// ============================================

function loadFromStorage(): MockStore | null {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data) as MockStore;
        }
    } catch (e) {
        console.warn('Failed to load mock store from localStorage:', e);
    }
    return null;
}

function saveToStorage(data: MockStore): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save mock store to localStorage:', e);
    }
}

// ============================================
// INITIALIZATION
// ============================================

export function initializeStore(): MockStore {
    if (store) return store;

    const loaded = loadFromStorage();
    store = loaded || getDefaultStore();

    // Save if we just created a new one
    if (!loaded) {
        saveToStorage(store);
    }

    return store;
}

export function getStore(): MockStore {
    if (!store) {
        return initializeStore();
    }
    return store;
}

export function resetStore(): void {
    store = getDefaultStore();
    saveToStorage(store);
}

function persist(): void {
    if (store) {
        saveToStorage(store);
    }
}

// ============================================
// ID GENERATION
// ============================================

function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// AUDIT LOGGING
// ============================================

export function logAuditEvent(
    userId: string,
    userName: string,
    action: string,
    target: string,
    organizationId: string
): AuditLogEntry {
    const s = getStore();
    const entry: AuditLogEntry = {
        id: generateId('log'),
        userId,
        userName,
        action,
        target,
        timestamp: 'Just now',
        organizationId,
        createdAt: Date.now(),
    };
    s.auditLogs.unshift(entry);
    persist();
    return entry;
}

export function getAuditLogs(tenantId: string): AuditLogEntry[] {
    const s = getStore();
    return s.auditLogs
        .filter(log => log.organizationId === tenantId)
        .sort((a, b) => b.createdAt - a.createdAt);
}

// ============================================
// ORGANIZATIONS
// ============================================

export function getOrganizations(): Organization[] {
    return getStore().organizations;
}

export function getOrganization(id: string): Organization | undefined {
    return getStore().organizations.find(o => o.id === id);
}

export function getUserOrganizations(userId: string): Organization[] {
    const s = getStore();
    const memberOrgIds = s.memberships
        .filter(m => m.userId === userId)
        .map(m => m.organizationId);
    return s.organizations.filter(o => memberOrgIds.includes(o.id));
}

// ============================================
// PROJECTS CRUD
// ============================================

export function getProjects(tenantId: string): Project[] {
    return getStore().projects.filter(p => p.organizationId === tenantId);
}

export function getProject(projectId: string): Project | undefined {
    return getStore().projects.find(p => p.id === projectId);
}

export interface CreateProjectPayload {
    name: string;
    description: string;
    status?: 'active' | 'archived' | 'completed';
}

export function createProject(
    tenantId: string,
    payload: CreateProjectPayload,
    actorId: string,
    actorName: string
): Project {
    const s = getStore();
    const project: Project = {
        id: generateId('proj'),
        name: payload.name,
        description: payload.description,
        status: payload.status || 'active',
        lastUpdated: 'Just now',
        memberCount: 1,
        organizationId: tenantId,
        createdAt: new Date().toISOString(),
        createdBy: actorId,
    };
    s.projects.push(project);

    // Audit log
    logAuditEvent(actorId, actorName, 'created project', project.name, tenantId);

    persist();
    return project;
}

export interface UpdateProjectPayload {
    name?: string;
    description?: string;
    status?: 'active' | 'archived' | 'completed';
    memberCount?: number;
}

export function updateProject(
    projectId: string,
    payload: UpdateProjectPayload,
    actorId: string,
    actorName: string
): Project | null {
    const s = getStore();
    const idx = s.projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const project = s.projects[idx];
    const updated: Project = {
        ...project,
        ...payload,
        lastUpdated: 'Just now',
    };
    s.projects[idx] = updated;

    // Audit log
    logAuditEvent(actorId, actorName, 'updated project', updated.name, project.organizationId);

    persist();
    return updated;
}

export function deleteProject(
    projectId: string,
    actorId: string,
    actorName: string
): boolean {
    const s = getStore();
    const idx = s.projects.findIndex(p => p.id === projectId);
    if (idx === -1) return false;

    const project = s.projects[idx];
    s.projects.splice(idx, 1);

    // Audit log
    logAuditEvent(actorId, actorName, 'deleted project', project.name, project.organizationId);

    persist();
    return true;
}

export function archiveProject(
    projectId: string,
    actorId: string,
    actorName: string
): Project | null {
    return updateProject(projectId, { status: 'archived' }, actorId, actorName);
}

// ============================================
// USERS CRUD
// ============================================

export function getUsers(tenantId: string): User[] {
    return getStore().users.filter(u => u.organizationId === tenantId && u.isActive);
}

export function getUser(userId: string): User | undefined {
    return getStore().users.find(u => u.id === userId);
}

export function getUserRole(userId: string, tenantId: string): Role | undefined {
    const s = getStore();
    const membership = s.memberships.find(m => m.userId === userId && m.organizationId === tenantId);
    return membership?.role;
}

export interface InviteUserPayload {
    email: string;
    name: string;
    role: Role;
}

export function inviteUser(
    tenantId: string,
    payload: InviteUserPayload,
    actorId: string,
    actorName: string
): User {
    const s = getStore();
    const user: User = {
        id: generateId('user'),
        name: payload.name,
        email: payload.email,
        role: payload.role,
        organizationId: tenantId,
        isActive: true,
        createdAt: new Date().toISOString(),
    };
    s.users.push(user);

    // Add membership
    s.memberships.push({
        userId: user.id,
        organizationId: tenantId,
        role: payload.role,
    });

    // Update org member count
    const org = s.organizations.find(o => o.id === tenantId);
    if (org) org.memberCount++;

    // Audit log
    logAuditEvent(actorId, actorName, 'invited', payload.email, tenantId);

    persist();
    return user;
}

export function updateUserRole(
    userId: string,
    tenantId: string,
    newRole: Role,
    actorId: string,
    actorName: string
): User | null {
    const s = getStore();
    const user = s.users.find(u => u.id === userId);
    if (!user) return null;

    const oldRole = user.role;
    user.role = newRole;

    // Update membership
    const membership = s.memberships.find(m => m.userId === userId && m.organizationId === tenantId);
    if (membership) membership.role = newRole;

    // Audit log
    logAuditEvent(actorId, actorName, 'changed role of', `${user.name} from ${oldRole} to ${newRole}`, tenantId);

    persist();
    return user;
}

export function deactivateUser(
    userId: string,
    tenantId: string,
    actorId: string,
    actorName: string
): boolean {
    const s = getStore();
    const user = s.users.find(u => u.id === userId);
    if (!user) return false;

    user.isActive = false;

    // Update org member count
    const org = s.organizations.find(o => o.id === tenantId);
    if (org && org.memberCount > 0) org.memberCount--;

    // Audit log
    logAuditEvent(actorId, actorName, 'deactivated', user.name, tenantId);

    persist();
    return true;
}

// ============================================
// SUBSCRIPTION / EXPORTS FOR REACTIVITY
// ============================================

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function notifyListeners(): void {
    listeners.forEach(fn => fn());
}

// Hook into persist to notify
const originalPersist = persist;
function persistAndNotify(): void {
    originalPersist();
    notifyListeners();
}

// Override persist
(function overridePersist() {
    // We'll call notifyListeners after each mutation
})();
