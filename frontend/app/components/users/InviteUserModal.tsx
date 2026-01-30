'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Role, getRoleBadgeClass, getRoleLabel } from '../../lib/permissions';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { email: string; name: string; role: Role }) => Promise<void>;
}

export function InviteUserModal({ isOpen, onClose, onSubmit }: InviteUserModalProps) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        role: 'viewer' as Role,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({ email: '', name: '', role: 'viewer' });
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onSubmit(formData);
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
            title="Invite Team Member"
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
                        {isLoading ? 'Sending...' : 'Send Invitation'}
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
                        htmlFor="name"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                        }}
                    >
                        Full Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="input"
                        autoFocus
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="email"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                        }}
                    >
                        Email Address *
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="input"
                    />
                </div>

                <div>
                    <label
                        htmlFor="role"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                        }}
                    >
                        Role
                    </label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '14px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'white',
                        }}
                    >
                        <option value="viewer">Viewer - Read-only access</option>
                        <option value="manager">Manager - Can create and edit</option>
                        <option value="admin">Admin - Full access</option>
                    </select>
                    <p style={{ fontSize: '12px', color: 'var(--foreground-muted)', marginTop: '6px' }}>
                        You can change the role later from user settings.
                    </p>
                </div>
            </form>
        </Modal>
    );
}
