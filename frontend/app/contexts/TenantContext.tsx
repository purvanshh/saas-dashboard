'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { organizations, Organization } from '../lib/mockData';

interface TenantContextType {
    currentOrganization: Organization;
    organizations: Organization[];
    switchOrganization: (orgId: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
    const [currentOrganization, setCurrentOrganization] = useState<Organization>(organizations[0]);

    const switchOrganization = (orgId: string) => {
        const org = organizations.find((o) => o.id === orgId);
        if (org) {
            setCurrentOrganization(org);
        }
    };

    return (
        <TenantContext.Provider
            value={{
                currentOrganization,
                organizations,
                switchOrganization,
            }}
        >
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}
