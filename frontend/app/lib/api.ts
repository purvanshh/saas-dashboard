import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseClient;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    status: number;
    details?: Record<string, string[]>;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
}

export interface MeResponse {
  user: UserProfile;
  organizations: Organization[];
  currentOrganization: Organization;
  role: 'admin' | 'manager' | 'viewer';
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageUsers: boolean;
    canManageOrg: boolean;
    canViewBilling: boolean;
    canViewAuditLogs: boolean;
  };
}

export interface KPIData {
  activeUsers: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  monthlyUsage: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
  errorRate: { value: number; change: number; trend: 'up' | 'down' | 'neutral'; unit: string };
  supportTickets: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
}

export interface UsageDataPoint {
  date: string;
  value: number;
}

export interface TeamActivityData {
  role: 'admin' | 'manager' | 'viewer';
  label: string;
  count: number;
  percentage: number;
  color: string;
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
}

export interface AuditLogBackendEntry {
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
  createdAt: string;
}

export interface InsightData {
  metric: string;
  change: number;
  direction: 'up' | 'down';
  reason: string;
  detail: string;
  recommendation?: string;
  drillTarget: string;
}

export interface SystemConstraint {
  id: string;
  message: string;
  type: 'limit' | 'sla' | 'performance' | 'maintenance';
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'deleted';
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  joinedAt: string;
  invitedBy?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          error: {
            code: responseData.error?.code || 'API_ERROR',
            message: responseData.error?.message || 'An error occurred',
            status: response.status,
            details: responseData.error?.details,
          },
        };
      }

      return { data: responseData };
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
          status: 0,
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async getMe(): Promise<ApiResponse<MeResponse>> {
    return this.get<MeResponse>('/api/me');
  }

  async getKPIs(): Promise<ApiResponse<{ kpis: KPIData }>> {
    return this.get<{ kpis: KPIData }>('/api/kpis');
  }

  async getUsageTrend(days: number = 7): Promise<ApiResponse<{ data: UsageDataPoint[] }>> {
    return this.get<{ data: UsageDataPoint[] }>(`/api/analytics/usage-trend?days=${days}`);
  }

  async getTeamActivity(): Promise<ApiResponse<{ data: TeamActivityData[] }>> {
    return this.get<{ data: TeamActivityData[] }>('/api/analytics/team-activity');
  }

  async getAuditLogs(limit: number = 10): Promise<ApiResponse<{ logs: AuditLogBackendEntry[] }>> {
    return this.get<{ logs: AuditLogBackendEntry[] }>(`/api/audit-logs?limit=${limit}`);
  }

  async getInsights(): Promise<ApiResponse<{ insights: InsightData[] }>> {
    return this.get<{ insights: InsightData[] }>('/api/analytics/insights');
  }

  async getSystemConstraints(): Promise<ApiResponse<{ constraints: SystemConstraint[] }>> {
    return this.get<{ constraints: SystemConstraint[] }>('/api/system/constraints');
  }

  async getProjects(): Promise<ApiResponse<{ projects: Project[] }>> {
    return this.get<{ projects: Project[] }>('/api/projects');
  }

  async createProject(name: string, description?: string): Promise<ApiResponse<{ project: Project }>> {
    return this.post<{ project: Project }>('/api/projects', { name, description });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<ApiResponse<{ project: Project }>> {
    return this.patch<{ project: Project }>(`/api/projects/${id}`, updates);
  }

  async deleteProject(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>(`/api/projects/${id}`);
  }

  async getUsers(): Promise<ApiResponse<{ users: TenantMember[] }>> {
    return this.get<{ users: TenantMember[] }>('/api/users');
  }

  async inviteUser(email: string, role: 'admin' | 'manager' | 'viewer'): Promise<ApiResponse<{ user: { id: string; email: string; role: string } }>> {
    return this.post<{ user: { id: string; email: string; role: string } }>('/api/users/invite', { email, role });
  }

  async updateUserRole(userId: string, role: 'admin' | 'manager' | 'viewer'): Promise<ApiResponse<{ userId: string; role: string }>> {
    return this.patch<{ userId: string; role: string }>(`/api/users/${userId}/role`, { role });
  }

  async switchOrganization(organizationId: string): Promise<ApiResponse<{ organization: Organization; role: string; permissions: Record<string, boolean> }>> {
    return this.post<{ organization: Organization; role: string; permissions: Record<string, boolean> }>('/api/organizations/switch', { organizationId });
  }
}

export const api = new ApiClient();
