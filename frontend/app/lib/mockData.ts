// Mock data for the multi-tenant SaaS dashboard

import { Role } from './permissions';

// Organizations
export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    plan: 'starter' | 'professional' | 'enterprise';
    memberCount: number;
    isNew?: boolean;
}

export const organizations: Organization[] = [
    { id: 'org_1', name: 'Acme Corporation', slug: 'acme-corp', plan: 'enterprise', memberCount: 142 },
    { id: 'org_2', name: 'TechStart Inc', slug: 'techstart', plan: 'professional', memberCount: 28 },
    { id: 'org_3', name: 'Global Dynamics', slug: 'global-dynamics', plan: 'enterprise', memberCount: 89 },
    { id: 'org_new', name: 'NewCo Labs', slug: 'newco-labs', plan: 'starter', memberCount: 1, isNew: true },
];

// Users
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: Role;
    organizationId: string;
}

export const users: User[] = [
    { id: 'user_1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', organizationId: 'org_1' },
    { id: 'user_2', name: 'Michael Torres', email: 'michael@acme.com', role: 'manager', organizationId: 'org_1' },
    { id: 'user_3', name: 'Emily Watson', email: 'emily@acme.com', role: 'viewer', organizationId: 'org_1' },
];

// Current user (for demo)
export const currentUser: User = users[0];

// KPI Data
export interface KPIData {
    organizationId: string;
    activeUsers: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
    monthlyUsage: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
    errorRate: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
    supportTickets: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
}

export const kpiData: Record<string, KPIData> = {
    org_1: {
        organizationId: 'org_1',
        activeUsers: { value: 1284, change: 12.5, trend: 'up' },
        monthlyUsage: { value: 847, change: 8.2, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.12, change: -15.3, trend: 'down', unit: '%' },
        supportTickets: { value: 23, change: -5, trend: 'down' },
    },
    org_2: {
        organizationId: 'org_2',
        activeUsers: { value: 256, change: 5.2, trend: 'up' },
        monthlyUsage: { value: 124, change: 3.1, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.08, change: -8.7, trend: 'down', unit: '%' },
        supportTickets: { value: 7, change: 2, trend: 'up' },
    },
    org_3: {
        organizationId: 'org_3',
        activeUsers: { value: 892, change: -2.1, trend: 'down' },
        monthlyUsage: { value: 623, change: 1.5, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.21, change: 4.2, trend: 'up', unit: '%' },
        supportTickets: { value: 18, change: 0, trend: 'neutral' },
    },
};

// Usage trend data (last 7 days)
export interface UsageDataPoint {
    date: string;
    value: number;
}

export const usageTrendData: Record<string, UsageDataPoint[]> = {
    org_1: [
        { date: 'Jan 24', value: 32400 },
        { date: 'Jan 25', value: 38200 },
        { date: 'Jan 26', value: 35800 },
        { date: 'Jan 27', value: 42100 },
        { date: 'Jan 28', value: 45600 },
        { date: 'Jan 29', value: 48900 },
        { date: 'Jan 30', value: 52300 },
    ],
    org_2: [
        { date: 'Jan 24', value: 8200 },
        { date: 'Jan 25', value: 7800 },
        { date: 'Jan 26', value: 9100 },
        { date: 'Jan 27', value: 8600 },
        { date: 'Jan 28', value: 9400 },
        { date: 'Jan 29', value: 10200 },
        { date: 'Jan 30', value: 9800 },
    ],
    org_3: [
        { date: 'Jan 24', value: 24500 },
        { date: 'Jan 25', value: 26100 },
        { date: 'Jan 26', value: 25800 },
        { date: 'Jan 27', value: 27300 },
        { date: 'Jan 28', value: 28100 },
        { date: 'Jan 29', value: 26900 },
        { date: 'Jan 30', value: 29400 },
    ],
};

// Team activity by role
export interface TeamActivityData {
    role: Role;
    label: string;
    count: number;
    percentage: number;
    color: string;
}

export const teamActivityData: Record<string, TeamActivityData[]> = {
    org_1: [
        { role: 'admin', label: 'Admins', count: 8, percentage: 5.6, color: '#2563eb' },
        { role: 'manager', label: 'Managers', count: 24, percentage: 16.9, color: '#f59e0b' },
        { role: 'viewer', label: 'Viewers', count: 110, percentage: 77.5, color: '#64748b' },
    ],
    org_2: [
        { role: 'admin', label: 'Admins', count: 3, percentage: 10.7, color: '#2563eb' },
        { role: 'manager', label: 'Managers', count: 8, percentage: 28.6, color: '#f59e0b' },
        { role: 'viewer', label: 'Viewers', count: 17, percentage: 60.7, color: '#64748b' },
    ],
    org_3: [
        { role: 'admin', label: 'Admins', count: 5, percentage: 5.6, color: '#2563eb' },
        { role: 'manager', label: 'Managers', count: 18, percentage: 20.2, color: '#f59e0b' },
        { role: 'viewer', label: 'Viewers', count: 66, percentage: 74.2, color: '#64748b' },
    ],
};

// Audit log entries
export interface AuditLogEntry {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    action: string;
    target: string;
    timestamp: string;
    organizationId: string;
}

export const auditLogs: AuditLogEntry[] = [
    { id: 'log_1', userId: 'user_1', userName: 'Sarah Chen', action: 'invited', target: 'james@acme.com', timestamp: '2 min ago', organizationId: 'org_1' },
    { id: 'log_2', userId: 'user_2', userName: 'Michael Torres', action: 'updated', target: 'Project Alpha settings', timestamp: '15 min ago', organizationId: 'org_1' },
    { id: 'log_3', userId: 'user_1', userName: 'Sarah Chen', action: 'changed role of', target: 'Emily Watson to Manager', timestamp: '1 hour ago', organizationId: 'org_1' },
    { id: 'log_4', userId: 'user_3', userName: 'Emily Watson', action: 'viewed', target: 'Analytics Dashboard', timestamp: '2 hours ago', organizationId: 'org_1' },
    { id: 'log_5', userId: 'user_1', userName: 'Sarah Chen', action: 'exported', target: 'Monthly Report', timestamp: '3 hours ago', organizationId: 'org_1' },
    { id: 'log_6', userId: 'user_2', userName: 'Michael Torres', action: 'created', target: 'Project Beta', timestamp: '5 hours ago', organizationId: 'org_1' },
    { id: 'log_7', userId: 'user_1', userName: 'Sarah Chen', action: 'updated', target: 'Billing information', timestamp: '1 day ago', organizationId: 'org_1' },
];

// Admin quick actions
export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    description: string;
}

export const adminQuickActions: QuickAction[] = [
    { id: 'invite', label: 'Invite User', icon: 'user-plus', description: 'Add new team members' },
    { id: 'export', label: 'Export Data', icon: 'download', description: 'Download reports' },
    { id: 'report', label: 'Generate Report', icon: 'file-text', description: 'Create custom report' },
    { id: 'settings', label: 'Org Settings', icon: 'settings', description: 'Manage organization' },
];
