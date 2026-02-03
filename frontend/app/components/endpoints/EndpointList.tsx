'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mockApi } from '../../lib/mockApi';
import { EndpointConfig } from '../../lib/mockDb';
import { canPerformAction, getPermissionDeniedMessage } from '../../lib/permissions';
import { EndpointFormModal } from './EndpointFormModal';
import { ConfirmDialog } from '../ui/Modal';
import { TableRowSkeleton } from '../ui/Skeleton';

const getMethodStyles = (method: EndpointConfig['method']) => {
    const base = {
        padding: '4px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
    };

    switch (method) {
        case 'GET':
            return { ...base, backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' };
        case 'POST':
            return { ...base, backgroundColor: 'var(--emerald-50)', color: 'var(--emerald-600)' };
        case 'PUT':
            return { ...base, backgroundColor: 'var(--amber-50)', color: 'var(--amber-600)' };
        case 'PATCH':
            return { ...base, backgroundColor: 'var(--indigo-50)', color: 'var(--indigo-700)' };
        case 'DELETE':
            return { ...base, backgroundColor: 'var(--red-50)', color: 'var(--red-600)' };
        default:
            return base;
    }
};

export function EndpointList() {
    const { currentOrganization } = useTenant();
    const { currentUser, currentRole } = useAuth();
    const { addToast } = useToast();

    const [endpoints, setEndpoints] = useState<EndpointConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConcurrencyError = () => {
        addToast('Endpoint data changed. Reloading...', 'error');
        setIsFormOpen(false);
        fetchEndpoints();
    };

    const fetchEndpoints = useCallback(async () => {
        if (!currentOrganization) return;
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.endpoints.list(currentOrganization.id);
            if (result.success && result.data) {
                setEndpoints(result.data);
            } else {
                setError(result.error || 'Failed to load endpoints');
            }
        } catch (err) {
            setError('An unexpected error occurred while loading endpoints.');
        } finally {
            setIsLoading(false);
        }
    }, [currentOrganization]);

    useEffect(() => {
        setTimeout(() => fetchEndpoints(), 0);
    }, [fetchEndpoints]);

    const canCreate = canPerformAction(currentRole, 'endpoint.create');
    const canEdit = canPerformAction(currentRole, 'endpoint.edit');
    const canDelete = canPerformAction(currentRole, 'endpoint.delete');

    const handleCreate = () => {
        if (!canCreate) {
            addToast(getPermissionDeniedMessage('endpoint.create'), 'error');
            return;
        }
        setSelectedEndpoint(null);
        setFormMode('create');
        setIsFormOpen(true);
    };

    const handleEdit = (endpoint: EndpointConfig) => {
        if (!canEdit) {
            addToast(getPermissionDeniedMessage('endpoint.edit'), 'error');
            return;
        }
        setSelectedEndpoint(endpoint);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleDeleteClick = (endpoint: EndpointConfig) => {
        if (!canDelete) {
            addToast(getPermissionDeniedMessage('endpoint.delete'), 'error');
            return;
        }
        setSelectedEndpoint(endpoint);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: {
        name: string;
        description?: string;
        method: EndpointConfig['method'];
        baseUrl: string;
        path: string;
        isActive: boolean;
        requiresAuth: boolean;
        rateLimitPerMin: number;
        timeoutMs: number;
    }) => {
        if (!currentOrganization || !currentUser) return;

        if (formMode === 'create') {
            const result = await mockApi.endpoints.create(
                currentOrganization.id,
                data,
                currentUser.id,
                currentUser.name
            );
            if (result.success) {
                addToast(`Endpoint "${data.name}" created successfully`, 'success');
                fetchEndpoints();
            } else {
                throw new Error(result.error || 'Failed to create endpoint');
            }
        } else if (selectedEndpoint) {
            const result = await mockApi.endpoints.update(
                selectedEndpoint.id,
                {
                    ...data,
                    expectedVersion: selectedEndpoint.version,
                },
                currentUser.id,
                currentUser.name
            );

            if (result.success) {
                addToast(`Endpoint "${data.name}" updated successfully`, 'success');
                fetchEndpoints();
            } else {
                if (result.error && result.error.includes('409')) {
                    handleConcurrencyError();
                    return;
                }
                throw new Error(result.error || 'Failed to update endpoint');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEndpoint || !currentUser) return;

        setIsSubmitting(true);
        const result = await mockApi.endpoints.delete(
            selectedEndpoint.id,
            currentUser.id,
            currentUser.name
        );
        setIsSubmitting(false);

        if (result.success) {
            addToast(`Endpoint "${selectedEndpoint.name}" deleted`, 'success');
            setIsDeleteOpen(false);
            setSelectedEndpoint(null);
            fetchEndpoints();
        } else {
            addToast(result.error || 'Failed to delete endpoint', 'error');
        }
    };

    if (error && !isLoading && endpoints.length === 0) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--red-50)' }}>
                <div style={{ marginBottom: '16px', color: 'var(--red-500)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--red-700)' }}>Failed to load endpoints</h3>
                <p style={{ color: 'var(--red-600)', margin: '0 0 16px 0', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                    {error}
                </p>
                <button className="btn btn-secondary" onClick={fetchEndpoints}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!isLoading && endpoints.length === 0) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                        <path d="M3 12h18" />
                        <path d="M3 6h18" />
                        <path d="M3 18h18" />
                        <circle cx="6" cy="6" r="2" />
                        <circle cx="6" cy="12" r="2" />
                        <circle cx="6" cy="18" r="2" />
                    </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>No endpoints yet</h3>
                <p style={{ color: 'var(--foreground-muted)', margin: '0 0 16px 0' }}>
                    Create an endpoint to start sending or receiving data.
                </p>
                {canCreate && (
                    <button className="btn btn-primary" onClick={handleCreate}>
                        Create First Endpoint
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Endpoint Configuration</h2>
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                            Manage API endpoints and access controls
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {currentRole === 'viewer' && (
                            <span className="badge badge-viewer">Read-only</span>
                        )}
                        <button className="btn btn-primary" onClick={handleCreate} disabled={!canCreate}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Endpoint
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Method</th>
                                <th>URL</th>
                                <th>Auth</th>
                                <th>Rate Limit</th>
                                <th>Status</th>
                                <th>Updated</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading
                                ? Array.from({ length: 4 }).map((_, idx) => (
                                    <TableRowSkeleton key={idx} columns={8} />
                                ))
                                : endpoints.map((endpoint) => (
                                    <tr key={endpoint.id}>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontWeight: 600 }}>{endpoint.name}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{endpoint.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={getMethodStyles(endpoint.method)}>{endpoint.method}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                                                {endpoint.baseUrl}{endpoint.path}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${endpoint.requiresAuth ? 'badge-success' : 'badge-warning'}`}>
                                                {endpoint.requiresAuth ? 'Required' : 'Public'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                                            {endpoint.rateLimitPerMin}/min
                                        </td>
                                        <td>
                                            <span className={`badge ${endpoint.isActive ? 'badge-success' : 'badge-error'}`}>
                                                {endpoint.isActive ? 'Active' : 'Paused'}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                                            {endpoint.lastUpdated}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => handleEdit(endpoint)}
                                                    disabled={!canEdit}
                                                    title={!canEdit ? getPermissionDeniedMessage('endpoint.edit') : 'Edit endpoint'}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => handleDeleteClick(endpoint)}
                                                    disabled={!canDelete}
                                                    style={{ color: 'var(--red-500)' }}
                                                    title={!canDelete ? getPermissionDeniedMessage('endpoint.delete') : 'Delete endpoint'}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EndpointFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                initialData={
                    selectedEndpoint
                        ? {
                            name: selectedEndpoint.name,
                            description: selectedEndpoint.description,
                            method: selectedEndpoint.method,
                            baseUrl: selectedEndpoint.baseUrl,
                            path: selectedEndpoint.path,
                            isActive: selectedEndpoint.isActive,
                            requiresAuth: selectedEndpoint.requiresAuth,
                            rateLimitPerMin: selectedEndpoint.rateLimitPerMin,
                            timeoutMs: selectedEndpoint.timeoutMs,
                        }
                        : undefined
                }
            />

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Endpoint"
                message={`Are you sure you want to delete "${selectedEndpoint?.name}"? This cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isSubmitting}
            />
        </>
    );
}
