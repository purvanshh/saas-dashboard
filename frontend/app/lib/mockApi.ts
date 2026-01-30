'use client';

/**
 * Mock API Layer
 * REST-like interface for all operations.
 * Simulates network delay and returns typed responses.
 * Designed to be easily replaceable with real backend calls.
 */

import { Role } from './permissions';
import * as db from './mockDb';

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
}

// ============================================
// NETWORK SIMULATION
// ============================================

interface NetworkConfig {
    minLatency: number;
    maxLatency: number;
    failureRate: number; // 0.0 to 1.0
    enabled: boolean;
}

const DEFAULT_CONFIG: NetworkConfig = {
    minLatency: 50,
    maxLatency: 800,
    failureRate: 0.05, // 5% failure rate
    enabled: true,
};

// Allow runtime configuration via window if needed for debugging
const getConfig = (): NetworkConfig => {
    if (typeof window !== 'undefined' && (window as any).__MOCK_API_CONFIG__) {
        return (window as any).__MOCK_API_CONFIG__;
    }
    return DEFAULT_CONFIG;
};

async function simulateNetworkCondition(): Promise<void> {
    const config = getConfig();
    if (!config.enabled) return;

    // 1. Variable Latency
    const delay = Math.floor(Math.random() * (config.maxLatency - config.minLatency + 1)) + config.minLatency;
    await new Promise(resolve => setTimeout(resolve, delay));

    // 2. Random Failures (500 Internal Server Error)
    if (Math.random() < config.failureRate) {
        throw new Error('Simulated 500: Internal Server Error (Random Failure)');
    }
}

async function apiCall<T>(fn: () => T): Promise<ApiResponse<T>> {
    try {
        await simulateNetworkCondition();
        const data = fn();
        return { success: true, data };
    } catch (e) {
        console.error('Mock API Error:', e);
        return { success: false, error: (e as Error).message };
    }
}

// ============================================
// PROJECTS API
// ============================================

export const projectsApi = {
    async list(tenantId: string): Promise<ApiResponse<db.Project[]>> {
        return apiCall(() => db.getProjects(tenantId));
    },

    async get(projectId: string): Promise<ApiResponse<db.Project | undefined>> {
        return apiCall(() => db.getProject(projectId));
    },

    async create(
        tenantId: string,
        payload: db.CreateProjectPayload,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<db.Project>> {
        return apiCall(() => db.createProject(tenantId, payload, actorId, actorName));
    },

    async update(
        projectId: string,
        payload: db.UpdateProjectPayload,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<db.Project | null>> {
        return apiCall(() => db.updateProject(projectId, payload, actorId, actorName));
    },

    async delete(
        projectId: string,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<boolean>> {
        return apiCall(() => db.deleteProject(projectId, actorId, actorName));
    },

    async archive(
        projectId: string,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<db.Project | null>> {
        return apiCall(() => db.archiveProject(projectId, actorId, actorName));
    },
};

// ============================================
// USERS API
// ============================================

export const usersApi = {
    async list(tenantId: string): Promise<ApiResponse<db.User[]>> {
        return apiCall(() => db.getUsers(tenantId));
    },

    async get(userId: string): Promise<ApiResponse<db.User | undefined>> {
        return apiCall(() => db.getUser(userId));
    },

    async invite(
        tenantId: string,
        payload: db.InviteUserPayload,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<db.User>> {
        return apiCall(() => db.inviteUser(tenantId, payload, actorId, actorName));
    },

    async updateRole(
        userId: string,
        tenantId: string,
        newRole: Role,
        actorId: string,
        actorName: string,
        expectedVersion?: number
    ): Promise<ApiResponse<db.User | null>> {
        return apiCall(() => db.updateUserRole(userId, tenantId, newRole, actorId, actorName, expectedVersion));
    },

    async deactivate(
        userId: string,
        tenantId: string,
        actorId: string,
        actorName: string
    ): Promise<ApiResponse<boolean>> {
        return apiCall(() => db.deactivateUser(userId, tenantId, actorId, actorName));
    },
};

// ============================================
// AUDIT LOGS API
// ============================================

export const auditApi = {
    async list(tenantId: string): Promise<ApiResponse<db.AuditLogEntry[]>> {
        return apiCall(() => db.getAuditLogs(tenantId));
    },

    async log(
        userId: string,
        userName: string,
        action: string,
        target: string,
        tenantId: string
    ): Promise<ApiResponse<db.AuditLogEntry>> {
        return apiCall(() => db.logAuditEvent(userId, userName, action, target, tenantId));
    },
};

// ============================================
// ORGANIZATIONS API
// ============================================

export const organizationsApi = {
    async list(): Promise<ApiResponse<db.Organization[]>> {
        return apiCall(() => db.getOrganizations());
    },

    async get(id: string): Promise<ApiResponse<db.Organization | undefined>> {
        return apiCall(() => db.getOrganization(id));
    },

    async getUserOrganizations(userId: string): Promise<ApiResponse<db.Organization[]>> {
        return apiCall(() => db.getUserOrganizations(userId));
    },
};

// ============================================
// COMBINED API OBJECT
// ============================================

export const mockApi = {
    projects: projectsApi,
    users: usersApi,
    audit: auditApi,
    organizations: organizationsApi,

    // Utility to reset store
    async resetStore(): Promise<void> {
        await simulateNetworkCondition();
        db.resetStore();
    },
};

export default mockApi;
