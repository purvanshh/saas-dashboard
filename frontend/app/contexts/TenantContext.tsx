'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { getOrganizations, initializeStore } from '../lib/mockDb';

// Storage key for persisting selected tenant
const TENANT_STORAGE_KEY = 'saas_dashboard_tenant';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  memberCount: number;
  isNew?: boolean;
}

interface TenantContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  mounted: boolean;
  switchOrganization: (orgId: string) => Promise<{ error?: string }>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

function loadTenantFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TENANT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveTenantToStorage(orgId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TENANT_STORAGE_KEY, orgId);
  } catch {
    // Ignore storage errors
  }
}

// Default organization for consistent SSR/CSR
const DEFAULT_ORG: Organization = {
  id: 'org_1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  plan: 'professional',
  memberCount: 12,
};

export function TenantProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize with consistent default values
  const [organizations, setOrganizations] = useState<Organization[]>([DEFAULT_ORG]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization>(DEFAULT_ORG);

  // Mount effect
  useEffect(() => {
    // Initialize store and load data
    initializeStore();
    const orgs = getOrganizations();
    setOrganizations(orgs);

    // Load from storage after mount
    const storedOrgId = loadTenantFromStorage();
    if (storedOrgId) {
      const stored = orgs.find(o => o.id === storedOrgId);
      if (stored) {
        setCurrentOrganization(stored);
      }
    } else if (orgs.length > 0 && orgs[0].id !== DEFAULT_ORG.id) {
      // If no stored preference and actual orgs differ from default, use first actual org
      setCurrentOrganization(orgs[0]);
    }

    setMounted(true);
  }, []);

  const switchOrganization = useCallback(async (orgId: string): Promise<{ error?: string }> => {
    const org = organizations.find(o => o.id === orgId);
    if (!org) {
      return { error: 'Organization not found' };
    }

    setLoading(true);
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setCurrentOrganization(org);
      if (mounted) {
        saveTenantToStorage(orgId);
      }
      
      return {};
    } catch (error) {
      return { error: 'Failed to switch organization' };
    } finally {
      setLoading(false);
    }
  }, [organizations, mounted]);

  const refreshTenant = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      const orgs = getOrganizations();
      setOrganizations(orgs);
      
      // Ensure current org is still valid
      if (currentOrganization) {
        const updatedOrg = orgs.find(o => o.id === currentOrganization.id);
        if (updatedOrg) {
          setCurrentOrganization(updatedOrg);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [currentOrganization]);

  return (
    <TenantContext.Provider
      value={{
        currentOrganization,
        organizations,
        loading,
        mounted,
        switchOrganization,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    // Default fallback if not wrapped
    return {
      currentOrganization: DEFAULT_ORG,
      organizations: [DEFAULT_ORG],
      loading: false,
      mounted: false,
      switchOrganization: async () => ({ error: 'Context not available' }),
      refreshTenant: async () => {},
    };
  }
  return context;
}
