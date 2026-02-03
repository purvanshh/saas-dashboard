'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { EndpointConfig } from '../../lib/mockDb';

interface EndpointFormData {
    name: string;
    description?: string;
    method: EndpointConfig['method'];
    baseUrl: string;
    path: string;
    isActive: boolean;
    requiresAuth: boolean;
    rateLimitPerMin: number;
    timeoutMs: number;
}

interface EndpointFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EndpointFormData) => Promise<void>;
    initialData?: EndpointFormData;
    mode: 'create' | 'edit';
}

const DEFAULT_FORM: EndpointFormData = {
    name: '',
    description: '',
    method: 'POST',
    baseUrl: 'https://api.example.com',
    path: '/v1/events',
    isActive: true,
    requiresAuth: true,
    rateLimitPerMin: 60,
    timeoutMs: 2500,
};

export function EndpointFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}: EndpointFormModalProps) {
    const [formData, setFormData] = useState<EndpointFormData>(DEFAULT_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(DEFAULT_FORM);
        }
        setError(null);
    }, [initialData, isOpen]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            setError('Endpoint name is required');
            return;
        }

        if (!formData.baseUrl.trim()) {
            setError('Base URL is required');
            return;
        }

        if (!formData.path.trim()) {
            setError('Path is required');
            return;
        }

        if (formData.rateLimitPerMin <= 0 || formData.timeoutMs <= 0) {
            setError('Rate limit and timeout must be positive values');
            return;
        }

        const normalizedPath = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;

        setIsLoading(true);
        setError(null);

        try {
            await onSubmit({
                ...formData,
                path: normalizedPath,
            });
            onClose();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'create' ? 'Create Endpoint' : 'Edit Endpoint'}
            size="md"
            footer={
                <>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Endpoint' : 'Save Changes'}
                    </button>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div
                        style={{
                            padding: '12px',
                            backgroundColor: 'var(--red-50)',
                            color: 'var(--red-600)',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '14px',
                        }}
                    >
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="endpoint-name"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Endpoint Name *
                    </label>
                    <input
                        id="endpoint-name"
                        type="text"
                        value={formData.name}
                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                        placeholder="e.g., Billing Webhook"
                        className="input"
                        autoFocus
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="endpoint-description"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Description
                    </label>
                    <textarea
                        id="endpoint-description"
                        value={formData.description}
                        onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                        placeholder="Short description of what this endpoint does"
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '14px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'white',
                            color: 'var(--foreground)',
                            resize: 'vertical',
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                        <label
                            htmlFor="endpoint-method"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                color: 'var(--foreground)',
                            }}
                        >
                            Method
                        </label>
                        <select
                            id="endpoint-method"
                            value={formData.method}
                            onChange={(event) => setFormData({ ...formData, method: event.target.value as EndpointConfig['method'] })}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                fontSize: '14px',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'white',
                                color: 'var(--foreground)',
                            }}
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="endpoint-base"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                color: 'var(--foreground)',
                            }}
                        >
                            Base URL *
                        </label>
                        <input
                            id="endpoint-base"
                            type="text"
                            value={formData.baseUrl}
                            onChange={(event) => setFormData({ ...formData, baseUrl: event.target.value })}
                            placeholder="https://api.example.com"
                            className="input"
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="endpoint-path"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Path *
                    </label>
                    <input
                        id="endpoint-path"
                        type="text"
                        value={formData.path}
                        onChange={(event) => setFormData({ ...formData, path: event.target.value })}
                        placeholder="/v1/events"
                        className="input"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                        <label
                            htmlFor="endpoint-rate"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                color: 'var(--foreground)',
                            }}
                        >
                            Rate Limit / Min
                        </label>
                        <input
                            id="endpoint-rate"
                            type="number"
                            min={1}
                            value={formData.rateLimitPerMin}
                            onChange={(event) => setFormData({ ...formData, rateLimitPerMin: Number(event.target.value) })}
                            className="input"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="endpoint-timeout"
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                color: 'var(--foreground)',
                            }}
                        >
                            Timeout (ms)
                        </label>
                        <input
                            id="endpoint-timeout"
                            type="number"
                            min={100}
                            step={100}
                            value={formData.timeoutMs}
                            onChange={(event) => setFormData({ ...formData, timeoutMs: Number(event.target.value) })}
                            className="input"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--foreground)' }}>
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                        />
                        Active
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--foreground)' }}>
                        <input
                            type="checkbox"
                            checked={formData.requiresAuth}
                            onChange={(event) => setFormData({ ...formData, requiresAuth: event.target.checked })}
                        />
                        Requires Auth
                    </label>
                </div>
            </form>
        </Modal>
    );
}
