'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';

interface ProjectFormData {
    name: string;
    description: string;
    status: 'active' | 'archived' | 'completed';
}

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProjectFormData) => Promise<void>;
    initialData?: ProjectFormData;
    mode: 'create' | 'edit';
}

export function ProjectFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}: ProjectFormModalProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        name: '',
        description: '',
        status: 'active',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({ name: '', description: '', status: 'active' });
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Project name is required');
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
            title={mode === 'create' ? 'Create New Project' : 'Edit Project'}
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
                        {isLoading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Save Changes'}
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
                            color: 'var(--foreground)',
                        }}
                    >
                        Project Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Website Redesign"
                        className="input"
                        autoFocus
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label
                        htmlFor="description"
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
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the project"
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

                <div>
                    <label
                        htmlFor="status"
                        style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            marginBottom: '6px',
                            color: 'var(--foreground)',
                        }}
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'archived' | 'completed' })}
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
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
}
