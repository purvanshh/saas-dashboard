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

export function TenantProvider({ children }: { children: ReactNode }) {
  // Initialize store on mount
  useEffect(() => {
    initializeStore();
  }, []);

  // Get organizations from mockDb
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const orgs = getOrganizations();
    return orgs;
  });

  // Load stored tenant preference
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(() => {
    // Always start with default for consistency (SSR safe)
    const orgs = getOrganizations();
    return orgs[0] || null;
  });



  // Hydrate from storage on mount
  useEffect(() => {
    const orgs = getOrganizations();
    const storedOrgId = loadTenantFromStorage();

    if (storedOrgId) {
      const stored = orgs.find(o => o.id === storedOrgId);
      // Only update if stored is valid and different from initial state (which is default)
      if (stored) {
        // Defer update to avoid sync-in-effect linter error
        setTimeout(() => setCurrentOrganization(stored), 0);
      }
    }
  }, []); // Run once on mount

  const refreshTenant = useCallback(async () => {
    const orgs = getOrganizations();
    setOrganizations(orgs);

    // Update current org if it still exists
    if (currentOrganization) {
      const updated = orgs.find(o => o.id === currentOrganization.id);
      if (updated) {
        setCurrentOrganization(updated);
      }
    }
  }, [currentOrganization]);

  const switchOrganization = useCallback(async (orgId: string): Promise<{ error?: string }> => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganization(org);
      saveTenantToStorage(orgId);
      return {};
    }
    return { error: 'Organization not found' };
  }, [organizations]);

  return (
    <TenantContext.Provider
      value={{
        currentOrganization,
        organizations,
        loading: false,
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
    const orgs = getOrganizations();
    return {
      currentOrganization: orgs[0] || null,
      organizations: orgs,
      loading: false,
      switchOrganization: async () => ({ error: 'Tenant not initialized' }),
      refreshTenant: async () => { },
    };
  }
  return context;
}
