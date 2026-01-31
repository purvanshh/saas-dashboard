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
    { id: 'org_4', name: 'InnovateLabs', slug: 'innovate-labs', plan: 'professional', memberCount: 45 },
    { id: 'org_5', name: 'DataFlow Systems', slug: 'dataflow', plan: 'enterprise', memberCount: 234 },
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
    // Acme Corporation (org_1) - Enterprise
    { id: 'user_1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', organizationId: 'org_1' },
    { id: 'user_2', name: 'Michael Torres', email: 'michael@acme.com', role: 'manager', organizationId: 'org_1' },
    { id: 'user_3', name: 'Emily Watson', email: 'emily@acme.com', role: 'viewer', organizationId: 'org_1' },
    { id: 'user_14', name: 'James Rodriguez', email: 'james@acme.com', role: 'manager', organizationId: 'org_1' },
    { id: 'user_15', name: 'Lisa Park', email: 'lisa@acme.com', role: 'viewer', organizationId: 'org_1' },
    { id: 'user_16', name: 'David Kim', email: 'david@acme.com', role: 'admin', organizationId: 'org_1' },
    { id: 'user_17', name: 'Anna Martinez', email: 'anna@acme.com', role: 'manager', organizationId: 'org_1' },
    { id: 'user_18', name: 'Robert Johnson', email: 'robert@acme.com', role: 'viewer', organizationId: 'org_1' },

    // TechStart Inc (org_2) - Professional
    { id: 'user_4', name: 'Alex Kim', email: 'alex@techstart.io', role: 'admin', organizationId: 'org_2' },
    { id: 'user_5', name: 'Jordan Lee', email: 'jordan@techstart.io', role: 'manager', organizationId: 'org_2' },
    { id: 'user_6', name: 'Casey Smith', email: 'casey@techstart.io', role: 'viewer', organizationId: 'org_2' },
    { id: 'user_10', name: 'Sam Rivera', email: 'sam@techstart.io', role: 'manager', organizationId: 'org_2' },
    { id: 'user_11', name: 'Taylor Otwell', email: 'taylor@techstart.io', role: 'viewer', organizationId: 'org_2' },
    { id: 'user_19', name: 'Morgan Davis', email: 'morgan@techstart.io', role: 'viewer', organizationId: 'org_2' },

    // Global Dynamics (org_3) - Enterprise
    { id: 'user_7', name: 'Robert Fox', email: 'robert.fox@globaldynamics.com', role: 'admin', organizationId: 'org_3' },
    { id: 'user_8', name: 'Maria Garcia', email: 'm.garcia@globaldynamics.com', role: 'manager', organizationId: 'org_3' },
    { id: 'user_9', name: 'David Wong', email: 'd.wong@globaldynamics.com', role: 'viewer', organizationId: 'org_3' },
    { id: 'user_12', name: 'James Wilson', email: 'j.wilson@globaldynamics.com', role: 'viewer', organizationId: 'org_3' },
    { id: 'user_13', name: 'Linda Chen', email: 'l.chen@globaldynamics.com', role: 'manager', organizationId: 'org_3' },
    { id: 'user_20', name: 'Kevin Zhang', email: 'k.zhang@globaldynamics.com', role: 'admin', organizationId: 'org_3' },
    { id: 'user_21', name: 'Sophie Turner', email: 's.turner@globaldynamics.com', role: 'manager', organizationId: 'org_3' },

    // InnovateLabs (org_4) - Professional
    { id: 'user_22', name: 'Chris Anderson', email: 'chris@innovatelabs.com', role: 'admin', organizationId: 'org_4' },
    { id: 'user_23', name: 'Rachel Green', email: 'rachel@innovatelabs.com', role: 'manager', organizationId: 'org_4' },
    { id: 'user_24', name: 'Tom Wilson', email: 'tom@innovatelabs.com', role: 'viewer', organizationId: 'org_4' },

    // DataFlow Systems (org_5) - Enterprise
    { id: 'user_25', name: 'Jennifer Liu', email: 'jennifer@dataflow.com', role: 'admin', organizationId: 'org_5' },
    { id: 'user_26', name: 'Mark Thompson', email: 'mark@dataflow.com', role: 'manager', organizationId: 'org_5' },
    { id: 'user_27', name: 'Amy Foster', email: 'amy@dataflow.com', role: 'viewer', organizationId: 'org_5' },
];

// Current user (for demo)
export const currentUser: User = users[0];

// KPI Data - Expanded with more realistic metrics
export interface KPIData {
    organizationId: string;
    activeUsers: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
    monthlyUsage: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
    errorRate: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
    supportTickets: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
    revenue: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
    conversionRate: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
}

export const kpiData: Record<string, KPIData> = {
    org_1: {
        organizationId: 'org_1',
        activeUsers: { value: 1284, change: 12.5, trend: 'up' },
        monthlyUsage: { value: 847, change: 8.2, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.12, change: -15.3, trend: 'down', unit: '%' },
        supportTickets: { value: 23, change: -5, trend: 'down' },
        revenue: { value: 45600, change: 18.7, trend: 'up', unit: '$' },
        conversionRate: { value: 3.4, change: 0.8, trend: 'up', unit: '%' },
    },
    org_2: {
        organizationId: 'org_2',
        activeUsers: { value: 256, change: 5.2, trend: 'up' },
        monthlyUsage: { value: 124, change: 3.1, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.08, change: -8.7, trend: 'down', unit: '%' },
        supportTickets: { value: 7, change: 2, trend: 'up' },
        revenue: { value: 12400, change: 22.1, trend: 'up', unit: '$' },
        conversionRate: { value: 4.1, change: 1.2, trend: 'up', unit: '%' },
    },
    org_3: {
        organizationId: 'org_3',
        activeUsers: { value: 892, change: -2.1, trend: 'down' },
        monthlyUsage: { value: 623, change: 1.5, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.21, change: 4.2, trend: 'up', unit: '%' },
        supportTickets: { value: 18, change: 0, trend: 'neutral' },
        revenue: { value: 78900, change: -3.2, trend: 'down', unit: '$' },
        conversionRate: { value: 2.8, change: -0.4, trend: 'down', unit: '%' },
    },
    org_4: {
        organizationId: 'org_4',
        activeUsers: { value: 445, change: 15.8, trend: 'up' },
        monthlyUsage: { value: 289, change: 12.4, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.15, change: -6.2, trend: 'down', unit: '%' },
        supportTickets: { value: 12, change: -3, trend: 'down' },
        revenue: { value: 23800, change: 28.5, trend: 'up', unit: '$' },
        conversionRate: { value: 5.2, change: 2.1, trend: 'up', unit: '%' },
    },
    org_5: {
        organizationId: 'org_5',
        activeUsers: { value: 2156, change: 7.3, trend: 'up' },
        monthlyUsage: { value: 1456, change: 5.8, trend: 'up', unit: 'GB' },
        errorRate: { value: 0.09, change: -12.1, trend: 'down', unit: '%' },
        supportTickets: { value: 34, change: -8, trend: 'down' },
        revenue: { value: 156700, change: 14.2, trend: 'up', unit: '$' },
        conversionRate: { value: 3.9, change: 0.6, trend: 'up', unit: '%' },
    },
};

// Usage trend data (last 30 days) - More comprehensive
export interface UsageDataPoint {
    date: string;
    value: number;
    users?: number;
    revenue?: number;
}

export const usageTrendData: Record<string, UsageDataPoint[]> = {
    org_1: [
        // Last 30 days of data
        { date: 'Jan 1', value: 28400, users: 1180, revenue: 42100 },
        { date: 'Jan 2', value: 31200, users: 1195, revenue: 43200 },
        { date: 'Jan 3', value: 29800, users: 1210, revenue: 44100 },
        { date: 'Jan 4', value: 33100, users: 1225, revenue: 44800 },
        { date: 'Jan 5', value: 35600, users: 1240, revenue: 45200 },
        { date: 'Jan 6', value: 32900, users: 1255, revenue: 45600 },
        { date: 'Jan 7', value: 38200, users: 1270, revenue: 46100 },
        { date: 'Jan 8', value: 35800, users: 1284, revenue: 45600 },
        { date: 'Jan 9', value: 40100, users: 1290, revenue: 46800 },
        { date: 'Jan 10', value: 42300, users: 1305, revenue: 47200 },
        { date: 'Jan 11', value: 39800, users: 1320, revenue: 47600 },
        { date: 'Jan 12', value: 44200, users: 1335, revenue: 48100 },
        { date: 'Jan 13', value: 41900, users: 1350, revenue: 48500 },
        { date: 'Jan 14', value: 46500, users: 1365, revenue: 49000 },
        { date: 'Jan 15', value: 43800, users: 1380, revenue: 49400 },
        { date: 'Jan 16', value: 48200, users: 1395, revenue: 49800 },
        { date: 'Jan 17', value: 45600, users: 1410, revenue: 50200 },
        { date: 'Jan 18', value: 50100, users: 1425, revenue: 50600 },
        { date: 'Jan 19', value: 47800, users: 1440, revenue: 51000 },
        { date: 'Jan 20', value: 52300, users: 1455, revenue: 51400 },
        { date: 'Jan 21', value: 49900, users: 1470, revenue: 51800 },
        { date: 'Jan 22', value: 54200, users: 1485, revenue: 52200 },
        { date: 'Jan 23', value: 51800, users: 1500, revenue: 52600 },
        { date: 'Jan 24', value: 56100, users: 1515, revenue: 53000 },
        { date: 'Jan 25', value: 53700, users: 1530, revenue: 53400 },
        { date: 'Jan 26', value: 58200, users: 1545, revenue: 53800 },
        { date: 'Jan 27', value: 55800, users: 1560, revenue: 54200 },
        { date: 'Jan 28', value: 60300, users: 1575, revenue: 54600 },
        { date: 'Jan 29', value: 57900, users: 1590, revenue: 55000 },
        { date: 'Jan 30', value: 62400, users: 1605, revenue: 55400 },
    ],
    org_2: [
        { date: 'Jan 1', value: 6200, users: 240, revenue: 11200 },
        { date: 'Jan 2', value: 6800, users: 245, revenue: 11600 },
        { date: 'Jan 3', value: 7100, users: 248, revenue: 11900 },
        { date: 'Jan 4', value: 7600, users: 252, revenue: 12100 },
        { date: 'Jan 5', value: 8400, users: 256, revenue: 12400 },
        { date: 'Jan 6', value: 8100, users: 256, revenue: 12400 },
        { date: 'Jan 7', value: 8600, users: 256, revenue: 12400 },
        { date: 'Jan 8', value: 9100, users: 256, revenue: 12400 },
        { date: 'Jan 9', value: 8800, users: 260, revenue: 12600 },
        { date: 'Jan 10', value: 9400, users: 264, revenue: 12800 },
        { date: 'Jan 11', value: 9100, users: 268, revenue: 13000 },
        { date: 'Jan 12', value: 9800, users: 272, revenue: 13200 },
        { date: 'Jan 13', value: 9500, users: 276, revenue: 13400 },
        { date: 'Jan 14', value: 10200, users: 280, revenue: 13600 },
        { date: 'Jan 15', value: 9900, users: 284, revenue: 13800 },
        { date: 'Jan 16', value: 10600, users: 288, revenue: 14000 },
        { date: 'Jan 17', value: 10300, users: 292, revenue: 14200 },
        { date: 'Jan 18', value: 11000, users: 296, revenue: 14400 },
        { date: 'Jan 19', value: 10700, users: 300, revenue: 14600 },
        { date: 'Jan 20', value: 11400, users: 304, revenue: 14800 },
        { date: 'Jan 21', value: 11100, users: 308, revenue: 15000 },
        { date: 'Jan 22', value: 11800, users: 312, revenue: 15200 },
        { date: 'Jan 23', value: 11500, users: 316, revenue: 15400 },
        { date: 'Jan 24', value: 12200, users: 320, revenue: 15600 },
        { date: 'Jan 25', value: 11900, users: 324, revenue: 15800 },
        { date: 'Jan 26', value: 12600, users: 328, revenue: 16000 },
        { date: 'Jan 27', value: 12300, users: 332, revenue: 16200 },
        { date: 'Jan 28', value: 13000, users: 336, revenue: 16400 },
        { date: 'Jan 29', value: 12700, users: 340, revenue: 16600 },
        { date: 'Jan 30', value: 13400, users: 344, revenue: 16800 },
    ],
    org_3: [
        { date: 'Jan 1', value: 24500, users: 850, revenue: 75000 },
        { date: 'Jan 2', value: 26100, users: 855, revenue: 75500 },
        { date: 'Jan 3', value: 25800, users: 860, revenue: 76000 },
        { date: 'Jan 4', value: 27300, users: 865, revenue: 76500 },
        { date: 'Jan 5', value: 28100, users: 870, revenue: 77000 },
        { date: 'Jan 6', value: 26900, users: 875, revenue: 77500 },
        { date: 'Jan 7', value: 29400, users: 880, revenue: 78000 },
        { date: 'Jan 8', value: 28200, users: 885, revenue: 78500 },
        { date: 'Jan 9', value: 30800, users: 890, revenue: 79000 },
        { date: 'Jan 10', value: 29600, users: 892, revenue: 79200 },
        { date: 'Jan 11', value: 32100, users: 894, revenue: 79400 },
        { date: 'Jan 12', value: 30900, users: 896, revenue: 79600 },
        { date: 'Jan 13', value: 33400, users: 898, revenue: 79800 },
        { date: 'Jan 14', value: 32200, users: 900, revenue: 80000 },
        { date: 'Jan 15', value: 34700, users: 902, revenue: 80200 },
        { date: 'Jan 16', value: 33500, users: 904, revenue: 80400 },
        { date: 'Jan 17', value: 36000, users: 906, revenue: 80600 },
        { date: 'Jan 18', value: 34800, users: 908, revenue: 80800 },
        { date: 'Jan 19', value: 37300, users: 910, revenue: 81000 },
        { date: 'Jan 20', value: 36100, users: 912, revenue: 81200 },
        { date: 'Jan 21', value: 38600, users: 914, revenue: 81400 },
        { date: 'Jan 22', value: 37400, users: 916, revenue: 81600 },
        { date: 'Jan 23', value: 39900, users: 918, revenue: 81800 },
        { date: 'Jan 24', value: 38700, users: 920, revenue: 82000 },
        { date: 'Jan 25', value: 41200, users: 922, revenue: 82200 },
        { date: 'Jan 26', value: 40000, users: 924, revenue: 82400 },
        { date: 'Jan 27', value: 42500, users: 926, revenue: 82600 },
        { date: 'Jan 28', value: 41300, users: 928, revenue: 82800 },
        { date: 'Jan 29', value: 43800, users: 930, revenue: 83000 },
        { date: 'Jan 30', value: 42600, users: 932, revenue: 83200 },
    ],
    org_4: [
        { date: 'Jan 1', value: 12200, users: 420, revenue: 22000 },
        { date: 'Jan 2', value: 13100, users: 425, revenue: 22500 },
        { date: 'Jan 3', value: 12800, users: 430, revenue: 23000 },
        { date: 'Jan 4', value: 13700, users: 435, revenue: 23500 },
        { date: 'Jan 5', value: 14600, users: 440, revenue: 24000 },
        { date: 'Jan 6', value: 14300, users: 445, revenue: 24500 },
        { date: 'Jan 7', value: 15200, users: 450, revenue: 25000 },
        { date: 'Jan 8', value: 14900, users: 455, revenue: 25500 },
        { date: 'Jan 9', value: 15800, users: 460, revenue: 26000 },
        { date: 'Jan 10', value: 15500, users: 465, revenue: 26500 },
        { date: 'Jan 11', value: 16400, users: 470, revenue: 27000 },
        { date: 'Jan 12', value: 16100, users: 475, revenue: 27500 },
        { date: 'Jan 13', value: 17000, users: 480, revenue: 28000 },
        { date: 'Jan 14', value: 16700, users: 485, revenue: 28500 },
        { date: 'Jan 15', value: 17600, users: 490, revenue: 29000 },
        { date: 'Jan 16', value: 17300, users: 495, revenue: 29500 },
        { date: 'Jan 17', value: 18200, users: 500, revenue: 30000 },
        { date: 'Jan 18', value: 17900, users: 505, revenue: 30500 },
        { date: 'Jan 19', value: 18800, users: 510, revenue: 31000 },
        { date: 'Jan 20', value: 18500, users: 515, revenue: 31500 },
        { date: 'Jan 21', value: 19400, users: 520, revenue: 32000 },
        { date: 'Jan 22', value: 19100, users: 525, revenue: 32500 },
        { date: 'Jan 23', value: 20000, users: 530, revenue: 33000 },
        { date: 'Jan 24', value: 19700, users: 535, revenue: 33500 },
        { date: 'Jan 25', value: 20600, users: 540, revenue: 34000 },
        { date: 'Jan 26', value: 20300, users: 545, revenue: 34500 },
        { date: 'Jan 27', value: 21200, users: 550, revenue: 35000 },
        { date: 'Jan 28', value: 20900, users: 555, revenue: 35500 },
        { date: 'Jan 29', value: 21800, users: 560, revenue: 36000 },
        { date: 'Jan 30', value: 21500, users: 565, revenue: 36500 },
    ],
    org_5: [
        { date: 'Jan 1', value: 45200, users: 2100, revenue: 150000 },
        { date: 'Jan 2', value: 47800, users: 2110, revenue: 151000 },
        { date: 'Jan 3', value: 46500, users: 2120, revenue: 152000 },
        { date: 'Jan 4', value: 49100, users: 2130, revenue: 153000 },
        { date: 'Jan 5', value: 51700, users: 2140, revenue: 154000 },
        { date: 'Jan 6', value: 50400, users: 2150, revenue: 155000 },
        { date: 'Jan 7', value: 53000, users: 2156, revenue: 156000 },
        { date: 'Jan 8', value: 51800, users: 2156, revenue: 156700 },
        { date: 'Jan 9', value: 54600, users: 2160, revenue: 157000 },
        { date: 'Jan 10', value: 53300, users: 2165, revenue: 157500 },
        { date: 'Jan 11', value: 56100, users: 2170, revenue: 158000 },
        { date: 'Jan 12', value: 54900, users: 2175, revenue: 158500 },
        { date: 'Jan 13', value: 57800, users: 2180, revenue: 159000 },
        { date: 'Jan 14', value: 56500, users: 2185, revenue: 159500 },
        { date: 'Jan 15', value: 59400, users: 2190, revenue: 160000 },
        { date: 'Jan 16', value: 58100, users: 2195, revenue: 160500 },
        { date: 'Jan 17', value: 61000, users: 2200, revenue: 161000 },
        { date: 'Jan 18', value: 59700, users: 2205, revenue: 161500 },
        { date: 'Jan 19', value: 62600, users: 2210, revenue: 162000 },
        { date: 'Jan 20', value: 61300, users: 2215, revenue: 162500 },
        { date: 'Jan 21', value: 64200, users: 2220, revenue: 163000 },
        { date: 'Jan 22', value: 62900, users: 2225, revenue: 163500 },
        { date: 'Jan 23', value: 65800, users: 2230, revenue: 164000 },
        { date: 'Jan 24', value: 64500, users: 2235, revenue: 164500 },
        { date: 'Jan 25', value: 67400, users: 2240, revenue: 165000 },
        { date: 'Jan 26', value: 66100, users: 2245, revenue: 165500 },
        { date: 'Jan 27', value: 69000, users: 2250, revenue: 166000 },
        { date: 'Jan 28', value: 67700, users: 2255, revenue: 166500 },
        { date: 'Jan 29', value: 70600, users: 2260, revenue: 167000 },
        { date: 'Jan 30', value: 69300, users: 2265, revenue: 167500 },
    ],
};

// Team activity by role - Enhanced
export interface TeamActivityData {
    role: Role;
    label: string;
    count: number;
    percentage: number;
    color: string;
    growth: number;
}

export const teamActivityData: Record<string, TeamActivityData[]> = {
    org_1: [
        { role: 'admin', label: 'Admins', count: 8, percentage: 5.6, color: '#ef4444', growth: 2 },
        { role: 'manager', label: 'Managers', count: 24, percentage: 16.9, color: '#f59e0b', growth: 5 },
        { role: 'viewer', label: 'Viewers', count: 110, percentage: 77.5, color: '#64748b', growth: 18 },
    ],
    org_2: [
        { role: 'admin', label: 'Admins', count: 3, percentage: 10.7, color: '#ef4444', growth: 1 },
        { role: 'manager', label: 'Managers', count: 8, percentage: 28.6, color: '#f59e0b', growth: 2 },
        { role: 'viewer', label: 'Viewers', count: 17, percentage: 60.7, color: '#64748b', growth: 4 },
    ],
    org_3: [
        { role: 'admin', label: 'Admins', count: 5, percentage: 5.6, color: '#ef4444', growth: 0 },
        { role: 'manager', label: 'Managers', count: 18, percentage: 20.2, color: '#f59e0b', growth: 3 },
        { role: 'viewer', label: 'Viewers', count: 66, percentage: 74.2, color: '#64748b', growth: -2 },
    ],
};

// Audit log entries - Much more comprehensive
export interface AuditLogEntry {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    action: string;
    target: string;
    timestamp: string;
    organizationId: string;
    category: 'user' | 'project' | 'system' | 'security' | 'billing';
    severity: 'low' | 'medium' | 'high';
}

export const auditLogs: AuditLogEntry[] = [
    // Recent activity
    { id: 'log_1', userId: 'user_1', userName: 'Sarah Chen', action: 'invited', target: 'james@acme.com', timestamp: '2 min ago', organizationId: 'org_1', category: 'user', severity: 'low' },
    { id: 'log_2', userId: 'user_2', userName: 'Michael Torres', action: 'updated', target: 'Project Alpha settings', timestamp: '15 min ago', organizationId: 'org_1', category: 'project', severity: 'low' },
    { id: 'log_3', userId: 'user_1', userName: 'Sarah Chen', action: 'changed role of', target: 'Emily Watson to Manager', timestamp: '1 hour ago', organizationId: 'org_1', category: 'user', severity: 'medium' },
    { id: 'log_4', userId: 'user_3', userName: 'Emily Watson', action: 'viewed', target: 'Analytics Dashboard', timestamp: '2 hours ago', organizationId: 'org_1', category: 'system', severity: 'low' },
    { id: 'log_5', userId: 'user_1', userName: 'Sarah Chen', action: 'exported', target: 'Monthly Report', timestamp: '3 hours ago', organizationId: 'org_1', category: 'system', severity: 'low' },
    { id: 'log_6', userId: 'user_2', userName: 'Michael Torres', action: 'created', target: 'Project Beta', timestamp: '5 hours ago', organizationId: 'org_1', category: 'project', severity: 'low' },
    { id: 'log_7', userId: 'user_1', userName: 'Sarah Chen', action: 'updated', target: 'Billing information', timestamp: '1 day ago', organizationId: 'org_1', category: 'billing', severity: 'medium' },
    
    // Security events
    { id: 'log_8', userId: 'user_16', userName: 'David Kim', action: 'enabled', target: 'Two-factor authentication', timestamp: '2 days ago', organizationId: 'org_1', category: 'security', severity: 'high' },
    { id: 'log_9', userId: 'user_1', userName: 'Sarah Chen', action: 'revoked', target: 'API key for Mobile App', timestamp: '3 days ago', organizationId: 'org_1', category: 'security', severity: 'medium' },
    
    // System events
    { id: 'log_10', userId: 'system', userName: 'System', action: 'deployed', target: 'Version 2.4.1', timestamp: '1 week ago', organizationId: 'org_1', category: 'system', severity: 'low' },
    { id: 'log_11', userId: 'system', userName: 'System', action: 'backup completed', target: 'Database backup', timestamp: '1 week ago', organizationId: 'org_1', category: 'system', severity: 'low' },
    
    // TechStart Inc logs
    { id: 'log_12', userId: 'user_4', userName: 'Alex Kim', action: 'created project', target: 'Customer Dashboard', timestamp: '5 hours ago', organizationId: 'org_2', category: 'project', severity: 'low' },
    { id: 'log_13', userId: 'user_5', userName: 'Jordan Lee', action: 'invited', target: 'casey@techstart.io', timestamp: '1 day ago', organizationId: 'org_2', category: 'user', severity: 'low' },
    { id: 'log_14', userId: 'user_4', userName: 'Alex Kim', action: 'upgraded', target: 'Plan to Professional', timestamp: '2 days ago', organizationId: 'org_2', category: 'billing', severity: 'medium' },
    
    // Global Dynamics logs
    { id: 'log_15', userId: 'user_7', userName: 'Robert Fox', action: 'deleted project', target: 'Old Legacy App', timestamp: '2 days ago', organizationId: 'org_3', category: 'project', severity: 'high' },
    { id: 'log_16', userId: 'user_8', userName: 'Maria Garcia', action: 'invited', target: 'j.wilson@globaldynamics.com', timestamp: '1 week ago', organizationId: 'org_3', category: 'user', severity: 'low' },
    { id: 'log_17', userId: 'user_7', userName: 'Robert Fox', action: 'deactivated', target: 'James Wilson', timestamp: '1 day ago', organizationId: 'org_3', category: 'user', severity: 'medium' },
];

// Admin quick actions - Enhanced
export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    description: string;
    category: 'user' | 'data' | 'system' | 'billing';
    requiresPermission?: string;
}

export const adminQuickActions: QuickAction[] = [
    { id: 'invite', label: 'Invite User', icon: 'user-plus', description: 'Add new team members', category: 'user', requiresPermission: 'manageUsers' },
    { id: 'export', label: 'Export Data', icon: 'download', description: 'Download reports and analytics', category: 'data' },
    { id: 'report', label: 'Generate Report', icon: 'file-text', description: 'Create custom analytics report', category: 'data' },
    { id: 'settings', label: 'Org Settings', icon: 'settings', description: 'Manage organization settings', category: 'system', requiresPermission: 'manageOrganization' },
    { id: 'billing', label: 'Billing', icon: 'credit-card', description: 'View billing and subscription', category: 'billing', requiresPermission: 'manageBilling' },
    { id: 'backup', label: 'Backup Data', icon: 'database', description: 'Create data backup', category: 'system', requiresPermission: 'manageOrganization' },
    { id: 'integrations', label: 'Integrations', icon: 'link', description: 'Manage third-party integrations', category: 'system', requiresPermission: 'manageOrganization' },
    { id: 'audit', label: 'Audit Logs', icon: 'shield', description: 'View security and activity logs', category: 'system' },
];

// Projects - Significantly expanded
export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'completed' | 'on-hold';
    lastUpdated: string;
    memberCount: number;
    organizationId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress: number;
    dueDate?: string;
    tags: string[];
    budget?: number;
    spent?: number;
}

export const projects: Project[] = [
    // Acme Corporation projects
    { 
        id: 'proj_1', 
        name: 'Website Redesign', 
        description: 'Complete overhaul of the main marketing website with modern design and improved UX', 
        status: 'active', 
        lastUpdated: '2 hours ago', 
        memberCount: 5, 
        organizationId: 'org_1',
        priority: 'high',
        progress: 75,
        dueDate: 'Feb 15, 2026',
        tags: ['design', 'marketing', 'frontend'],
        budget: 50000,
        spent: 37500
    },
    { 
        id: 'proj_2', 
        name: 'Mobile App Beta', 
        description: 'iOS and Android beta testing phase with user feedback integration', 
        status: 'active', 
        lastUpdated: '1 day ago', 
        memberCount: 8, 
        organizationId: 'org_1',
        priority: 'critical',
        progress: 90,
        dueDate: 'Feb 28, 2026',
        tags: ['mobile', 'testing', 'ios', 'android'],
        budget: 120000,
        spent: 108000
    },
    { 
        id: 'proj_3', 
        name: 'Legacy Migration', 
        description: 'Moving from V1 to V2 infrastructure with zero downtime', 
        status: 'completed', 
        lastUpdated: '1 month ago', 
        memberCount: 3, 
        organizationId: 'org_1',
        priority: 'medium',
        progress: 100,
        tags: ['infrastructure', 'migration', 'backend'],
        budget: 80000,
        spent: 75000
    },
    { 
        id: 'proj_28', 
        name: 'AI Integration', 
        description: 'Implementing machine learning features for predictive analytics', 
        status: 'active', 
        lastUpdated: '3 hours ago', 
        memberCount: 6, 
        organizationId: 'org_1',
        priority: 'high',
        progress: 45,
        dueDate: 'Mar 30, 2026',
        tags: ['ai', 'ml', 'analytics'],
        budget: 200000,
        spent: 90000
    },
    { 
        id: 'proj_29', 
        name: 'Security Audit', 
        description: 'Comprehensive security review and penetration testing', 
        status: 'on-hold', 
        lastUpdated: '1 week ago', 
        memberCount: 4, 
        organizationId: 'org_1',
        priority: 'critical',
        progress: 25,
        tags: ['security', 'audit', 'compliance'],
        budget: 60000,
        spent: 15000
    },

    // TechStart Inc projects
    { 
        id: 'proj_4', 
        name: 'API Gateway', 
        description: 'Centralized API management system with rate limiting and analytics', 
        status: 'active', 
        lastUpdated: '3 hours ago', 
        memberCount: 4, 
        organizationId: 'org_2',
        priority: 'high',
        progress: 60,
        dueDate: 'Feb 20, 2026',
        tags: ['api', 'backend', 'infrastructure'],
        budget: 40000,
        spent: 24000
    },
    { 
        id: 'proj_5', 
        name: 'Customer Dashboard', 
        description: 'New analytics dashboard for customer self-service portal', 
        status: 'active', 
        lastUpdated: '5 hours ago', 
        memberCount: 6, 
        organizationId: 'org_2',
        priority: 'medium',
        progress: 80,
        dueDate: 'Feb 10, 2026',
        tags: ['dashboard', 'analytics', 'frontend'],
        budget: 35000,
        spent: 28000
    },
    { 
        id: 'proj_6', 
        name: 'Internal Tools', 
        description: 'Admin panel updates and internal workflow automation', 
        status: 'archived', 
        lastUpdated: '2 weeks ago', 
        memberCount: 2, 
        organizationId: 'org_2',
        priority: 'low',
        progress: 100,
        tags: ['internal', 'admin', 'automation'],
        budget: 15000,
        spent: 14500
    },
    { 
        id: 'proj_9', 
        name: 'Growth Experiments', 
        description: 'A/B testing framework setup for conversion optimization', 
        status: 'completed', 
        lastUpdated: '1 week ago', 
        memberCount: 3, 
        organizationId: 'org_2',
        priority: 'medium',
        progress: 100,
        tags: ['growth', 'testing', 'optimization'],
        budget: 25000,
        spent: 23000
    },

    // Global Dynamics projects
    { 
        id: 'proj_7', 
        name: 'Cloud Migration', 
        description: 'Moving on-premise servers to AWS with improved scalability', 
        status: 'active', 
        lastUpdated: '10 min ago', 
        memberCount: 12, 
        organizationId: 'org_3',
        priority: 'critical',
        progress: 65,
        dueDate: 'Mar 15, 2026',
        tags: ['cloud', 'aws', 'migration', 'infrastructure'],
        budget: 300000,
        spent: 195000
    },
    { 
        id: 'proj_8', 
        name: 'Security Compliance', 
        description: 'Q1 Security compliance check and SOC 2 certification', 
        status: 'completed', 
        lastUpdated: '3 days ago', 
        memberCount: 5, 
        organizationId: 'org_3',
        priority: 'high',
        progress: 100,
        tags: ['security', 'compliance', 'soc2'],
        budget: 75000,
        spent: 72000
    },
    { 
        id: 'proj_11', 
        name: 'Enterprise ERP', 
        description: 'Implementation of new ERP system for global operations', 
        status: 'active', 
        lastUpdated: '1 hour ago', 
        memberCount: 25, 
        organizationId: 'org_3',
        priority: 'critical',
        progress: 40,
        dueDate: 'Jun 30, 2026',
        tags: ['erp', 'enterprise', 'operations'],
        budget: 500000,
        spent: 200000
    },
    { 
        id: 'proj_12', 
        name: 'Data Warehouse', 
        description: 'Snowflake integration project for business intelligence', 
        status: 'active', 
        lastUpdated: '4 hours ago', 
        memberCount: 8, 
        organizationId: 'org_3',
        priority: 'high',
        progress: 55,
        dueDate: 'Apr 15, 2026',
        tags: ['data', 'warehouse', 'bi', 'snowflake'],
        budget: 150000,
        spent: 82500
    },
    { 
        id: 'proj_13', 
        name: 'GDPR Compliance', 
        description: 'EU data protection updates and privacy policy implementation', 
        status: 'completed', 
        lastUpdated: '1 month ago', 
        memberCount: 4, 
        organizationId: 'org_3',
        priority: 'high',
        progress: 100,
        tags: ['gdpr', 'privacy', 'compliance'],
        budget: 45000,
        spent: 43000
    },
];

// Billing Plans - Enhanced
export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    yearlyPrice?: number;
    features: string[];
    limits: {
        users: number | 'unlimited';
        storage: string;
        apiCalls: string;
        projects: number | 'unlimited';
    };
    popular?: boolean;
}

export const plans: SubscriptionPlan[] = [
    { 
        id: 'starter', 
        name: 'Starter', 
        price: 29, 
        yearlyPrice: 290,
        features: [
            'Up to 5 users', 
            'Basic Analytics', 
            '10GB Storage',
            'Email Support',
            '5 Projects',
            'Basic Integrations'
        ],
        limits: {
            users: 5,
            storage: '10GB',
            apiCalls: '10K/month',
            projects: 5
        }
    },
    { 
        id: 'professional', 
        name: 'Professional', 
        price: 99, 
        yearlyPrice: 990,
        features: [
            'Up to 50 users', 
            'Advanced Analytics', 
            '100GB Storage', 
            'Priority Support',
            'Unlimited Projects',
            'Advanced Integrations',
            'Custom Reports',
            'API Access'
        ],
        limits: {
            users: 50,
            storage: '100GB',
            apiCalls: '100K/month',
            projects: 'unlimited'
        },
        popular: true
    },
    { 
        id: 'enterprise', 
        name: 'Enterprise', 
        price: 499, 
        yearlyPrice: 4990,
        features: [
            'Unlimited users', 
            'Custom Analytics', 
            'Unlimited Storage', 
            'Dedicated Success Manager', 
            'SSO & SAML',
            'Advanced Security',
            'Custom Integrations',
            'SLA Guarantee',
            'Audit Logs',
            'White-label Options'
        ],
        limits: {
            users: 'unlimited',
            storage: 'Unlimited',
            apiCalls: 'Unlimited',
            projects: 'unlimited'
        }
    },
];

export interface BillingInfo {
    organizationId: string;
    currentPlanId: string;
    nextBillingDate: string;
    paymentMethod: string;
    billingCycle: 'monthly' | 'yearly';
    invoices: { id: string; date: string; amount: number; status: 'paid' | 'pending' | 'failed' }[];
    usage: {
        users: number;
        storage: number;
        apiCalls: number;
        projects: number;
    };
}

export const billingData: Record<string, BillingInfo> = {
    org_1: {
        organizationId: 'org_1',
        currentPlanId: 'enterprise',
        nextBillingDate: 'Feb 28, 2026',
        paymentMethod: 'Visa ending in 4242',
        billingCycle: 'monthly',
        usage: {
            users: 142,
            storage: 847,
            apiCalls: 2400000,
            projects: 12
        },
        invoices: [
            { id: 'INV-2026-001', date: 'Jan 28, 2026', amount: 499, status: 'paid' },
            { id: 'INV-2025-012', date: 'Dec 28, 2025', amount: 499, status: 'paid' },
            { id: 'INV-2025-011', date: 'Nov 28, 2025', amount: 499, status: 'paid' },
            { id: 'INV-2025-010', date: 'Oct 28, 2025', amount: 499, status: 'paid' },
            { id: 'INV-2025-009', date: 'Sep 28, 2025', amount: 499, status: 'paid' },
        ]
    },
    org_2: {
        organizationId: 'org_2',
        currentPlanId: 'professional',
        nextBillingDate: 'Feb 15, 2026',
        paymentMethod: 'Mastercard ending in 8888',
        billingCycle: 'monthly',
        usage: {
            users: 28,
            storage: 124,
            apiCalls: 45000,
            projects: 8
        },
        invoices: [
            { id: 'INV-2026-002', date: 'Jan 15, 2026', amount: 99, status: 'paid' },
            { id: 'INV-2025-013', date: 'Dec 15, 2025', amount: 99, status: 'paid' },
            { id: 'INV-2025-012', date: 'Nov 15, 2025', amount: 29, status: 'paid' }, // Upgraded mid-month
        ]
    },
    org_3: {
        organizationId: 'org_3',
        currentPlanId: 'enterprise',
        nextBillingDate: 'Feb 10, 2026',
        paymentMethod: 'American Express ending in 1234',
        billingCycle: 'yearly',
        usage: {
            users: 89,
            storage: 623,
            apiCalls: 1800000,
            projects: 15
        },
        invoices: [
            { id: 'INV-2026-003', date: 'Feb 10, 2025', amount: 4990, status: 'paid' }, // Yearly
            { id: 'INV-2025-001', date: 'Feb 10, 2024', amount: 4990, status: 'paid' },
        ]
    }
};

// Insights Data - Much more comprehensive
export interface InsightData {
    id: string;
    metric: string;
    direction: 'up' | 'down';
    change: number;
    reason: string;
    detail: string;
    drillTarget: string;
    recommendation?: string;
    organizationId: string;
    category: 'performance' | 'users' | 'revenue' | 'system' | 'security';
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
}

export const insightsData: Record<string, InsightData[]> = {
    org_1: [
        {
            id: 'insight_1',
            organizationId: 'org_1',
            metric: 'Active Users',
            direction: 'up',
            change: 12.5,
            reason: 'Successful marketing campaign',
            detail: 'New user signups increased by 45% this week due to the "Winter Sale" promotion and improved onboarding flow.',
            drillTarget: 'Analytics > User Growth',
            recommendation: 'Consider extending the campaign for another week to maximize growth momentum.',
            category: 'users',
            priority: 'medium',
            actionable: true
        },
        {
            id: 'insight_2',
            organizationId: 'org_1',
            metric: 'Error Rate',
            direction: 'down',
            change: 15.3,
            reason: 'Recent bug fixes deployment',
            detail: 'The API stability patch (v2.4.1) resolved the intermittent timeout issues affecting 12% of requests.',
            drillTarget: 'Analytics > System Health',
            category: 'system',
            priority: 'low',
            actionable: false
        },
        {
            id: 'insight_3',
            organizationId: 'org_1',
            metric: 'Revenue',
            direction: 'up',
            change: 18.7,
            reason: 'Enterprise plan upgrades',
            detail: '3 organizations upgraded to Enterprise plan this month, contributing $1,497 in additional MRR.',
            drillTarget: 'Billing > Revenue Analysis',
            recommendation: 'Reach out to Professional plan customers with similar usage patterns.',
            category: 'revenue',
            priority: 'high',
            actionable: true
        },
        {
            id: 'insight_4',
            organizationId: 'org_1',
            metric: 'Support Tickets',
            direction: 'down',
            change: 22.1,
            reason: 'Improved documentation',
            detail: 'New help center and video tutorials reduced common support requests by 35%.',
            drillTarget: 'Support > Ticket Analysis',
            category: 'performance',
            priority: 'low',
            actionable: false
        }
    ],
    org_2: [
        {
            id: 'insight_5',
            organizationId: 'org_2',
            metric: 'Conversion Rate',
            direction: 'up',
            change: 28.4,
            reason: 'A/B test winner implemented',
            detail: 'New signup flow with social login options increased trial-to-paid conversion by 28.4%.',
            drillTarget: 'Analytics > Conversion Funnel',
            recommendation: 'Apply similar UX improvements to other conversion points.',
            category: 'revenue',
            priority: 'high',
            actionable: true
        },
        {
            id: 'insight_6',
            organizationId: 'org_2',
            metric: 'API Usage',
            direction: 'up',
            change: 45.2,
            reason: 'New integration launched',
            detail: 'Slack integration is driving 60% of the API usage increase, with 89% user adoption rate.',
            drillTarget: 'Analytics > API Usage',
            recommendation: 'Consider building similar integrations for Microsoft Teams and Discord.',
            category: 'performance',
            priority: 'medium',
            actionable: true
        }
    ],
    org_3: [
        {
            id: 'insight_7',
            organizationId: 'org_3',
            metric: 'Team Velocity',
            direction: 'down',
            change: 5.2,
            reason: 'High technical debt',
            detail: 'Average PR merge time increased from 4h to 12h due to complex legacy code interactions.',
            drillTarget: 'Projects > Performance',
            recommendation: 'Schedule a sprint dedicated to refactoring and debt reduction.',
            category: 'performance',
            priority: 'high',
            actionable: true
        },
        {
            id: 'insight_8',
            organizationId: 'org_3',
            metric: 'Security Score',
            direction: 'up',
            change: 12.8,
            reason: 'SOC 2 compliance implementation',
            detail: 'Security audit completion and new access controls improved overall security posture.',
            drillTarget: 'Security > Compliance Dashboard',
            category: 'security',
            priority: 'medium',
            actionable: false
        }
    ]
};
