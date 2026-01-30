'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mockApi } from '../../lib/mockApi';
import { Project } from '../../lib/mockDb';
import { canPerformAction, getPermissionDeniedMessage } from '../../lib/permissions';
import { ProjectFormModal } from './ProjectFormModal';
import { ConfirmDialog } from '../ui/Modal';
import { TableRowSkeleton } from '../ui/Skeleton';

// Helper for status colors
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'var(--emerald-500)';
        case 'completed': return 'var(--blue-500)';
        case 'archived': return 'var(--slate-400)';
        default: return 'var(--slate-400)';
    }
};

export function ProjectList() {
    const { currentOrganization } = useTenant();
    const { currentUser, currentRole } = useAuth();
    const { addToast } = useToast();

    // State
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch projects
    const fetchProjects = useCallback(async () => {
        if (!currentOrganization) return;
        setIsLoading(true);
        const result = await mockApi.projects.list(currentOrganization.id);
        if (result.success && result.data) {
            setProjects(result.data);
        }
        setIsLoading(false);
    }, [currentOrganization]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Permission checks
    const canCreate = canPerformAction(currentRole, 'project.create');
    const canEdit = canPerformAction(currentRole, 'project.edit');
    const canDelete = canPerformAction(currentRole, 'project.delete');

    // Handlers
    const handleCreate = () => {
        if (!canCreate) {
            addToast(getPermissionDeniedMessage('project.create'), 'error');
            return;
        }
        setSelectedProject(null);
        setFormMode('create');
        setIsFormOpen(true);
    };

    const handleEdit = (project: Project) => {
        if (!canEdit) {
            addToast(getPermissionDeniedMessage('project.edit'), 'error');
            return;
        }
        setSelectedProject(project);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleDeleteClick = (project: Project) => {
        if (!canDelete) {
            addToast(getPermissionDeniedMessage('project.delete'), 'error');
            return;
        }
        setSelectedProject(project);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (data: { name: string; description: string; status: 'active' | 'archived' | 'completed' }) => {
        if (!currentOrganization || !currentUser) return;

        if (formMode === 'create') {
            const result = await mockApi.projects.create(
                currentOrganization.id,
                data,
                currentUser.id,
                currentUser.name
            );
            if (result.success) {
                addToast(`Project "${data.name}" created successfully`, 'success');
                fetchProjects();
            } else {
                throw new Error(result.error || 'Failed to create project');
            }
        } else if (selectedProject) {
            const result = await mockApi.projects.update(
                selectedProject.id,
                data,
                currentUser.id,
                currentUser.name
            );
            if (result.success) {
                addToast(`Project "${data.name}" updated successfully`, 'success');
                fetchProjects();
            } else {
                throw new Error(result.error || 'Failed to update project');
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProject || !currentUser) return;

        setIsSubmitting(true);
        const result = await mockApi.projects.delete(
            selectedProject.id,
            currentUser.id,
            currentUser.name
        );
        setIsSubmitting(false);

        if (result.success) {
            addToast(`Project "${selectedProject.name}" deleted`, 'success');
            setIsDeleteOpen(false);
            setSelectedProject(null);
            fetchProjects();
        } else {
            addToast(result.error || 'Failed to delete project', 'error');
        }
    };

    // Render empty state
    if (!isLoading && projects.length === 0) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>No projects yet</h3>
                <p style={{ color: 'var(--foreground-muted)', margin: '0 0 16px 0' }}>
                    Get started by creating your first project.
                </p>
                {canCreate && (
                    <button className="btn btn-primary" onClick={handleCreate}>
                        Create First Project
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
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Active Projects</h2>
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                            Manage your team's initiatives
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={!canCreate}
                        title={!canCreate ? getPermissionDeniedMessage('project.create') : undefined}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Project
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Project Name</th>
                                <th style={{ textAlign: 'left' }}>Status</th>
                                <th style={{ textAlign: 'left' }}>Members</th>
                                <th style={{ textAlign: 'left' }}>Last Updated</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <>
                                    <TableRowSkeleton columns={5} />
                                    <TableRowSkeleton columns={5} />
                                    <TableRowSkeleton columns={5} />
                                </>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 500, color: 'var(--foreground)' }}>{project.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--foreground-muted)' }}>{project.description}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    backgroundColor: `${getStatusColor(project.status)}20`,
                                                    color: getStatusColor(project.status),
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        backgroundColor: getStatusColor(project.status),
                                                        marginRight: '6px'
                                                    }}
                                                />
                                                {project.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{project.memberCount} members</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{project.lastUpdated}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button
                                                    className="btn btn-ghost"
                                                    style={{ padding: '6px', opacity: canEdit ? 1 : 0.5 }}
                                                    onClick={() => handleEdit(project)}
                                                    title={!canEdit ? getPermissionDeniedMessage('project.edit') : 'Edit project'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn btn-ghost"
                                                    style={{ padding: '6px', color: canDelete ? 'var(--red-500)' : 'var(--slate-300)' }}
                                                    onClick={() => handleDeleteClick(project)}
                                                    title={!canDelete ? getPermissionDeniedMessage('project.delete') : 'Delete project'}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <ProjectFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                initialData={selectedProject ? {
                    name: selectedProject.name,
                    description: selectedProject.description,
                    status: selectedProject.status,
                } : undefined}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Project"
                message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
                isLoading={isSubmitting}
            />
        </>
    );
}
