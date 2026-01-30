'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { mockApi } from '../../lib/mockApi';
import { User } from '../../lib/mockDb';
import { Role, getRoleBadgeClass, getRoleLabel, canPerformAction, getPermissionDeniedMessage } from '../../lib/permissions';
import { InviteUserModal } from './InviteUserModal';
import { ConfirmDialog } from '../ui/Modal';
import { TableRowSkeleton } from '../ui/Skeleton';

export function UserList() {
    const { currentOrganization } = useTenant();
    const { currentUser, currentRole } = useAuth();
    const { addToast } = useToast();

    // State
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        if (!currentOrganization) return;
        setIsLoading(true);
        const result = await mockApi.users.list(currentOrganization.id);
        if (result.success && result.data) {
            setUsers(result.data);
        }
        setIsLoading(false);
    }, [currentOrganization]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Permission checks
    const canInvite = canPerformAction(currentRole, 'user.invite');
    const canChangeRole = canPerformAction(currentRole, 'user.changeRole');
    const canDeactivate = canPerformAction(currentRole, 'user.deactivate');

    // Handlers
    const handleInvite = () => {
        if (!canInvite) {
            addToast(getPermissionDeniedMessage('user.invite'), 'error');
            return;
        }
        setIsInviteOpen(true);
    };

    const handleInviteSubmit = async (data: { email: string; name: string; role: Role }) => {
        if (!currentOrganization || !currentUser) return;

        const result = await mockApi.users.invite(
            currentOrganization.id,
            data,
            currentUser.id,
            currentUser.name
        );

        if (result.success) {
            addToast(`Invitation sent to ${data.email}`, 'success');
            fetchUsers();
        } else {
            throw new Error(result.error || 'Failed to invite user');
        }
    };

    const handleRoleChange = async (user: User, newRole: Role) => {
        if (!canChangeRole) {
            addToast(getPermissionDeniedMessage('user.changeRole'), 'error');
            return;
        }
        if (!currentOrganization || !currentUser) return;

        const result = await mockApi.users.updateRole(
            user.id,
            currentOrganization.id,
            newRole,
            currentUser.id,
            currentUser.name
        );

        if (result.success) {
            addToast(`${user.name}'s role updated to ${getRoleLabel(newRole)}`, 'success');
            fetchUsers();
        } else {
            addToast(result.error || 'Failed to update role', 'error');
        }
    };

    const handleDeactivateClick = (user: User) => {
        if (!canDeactivate) {
            addToast(getPermissionDeniedMessage('user.deactivate'), 'error');
            return;
        }
        // Prevent self-deactivation
        if (user.id === currentUser?.id) {
            addToast('You cannot deactivate yourself', 'error');
            return;
        }
        setSelectedUser(user);
        setIsDeactivateOpen(true);
    };

    const handleDeactivateConfirm = async () => {
        if (!selectedUser || !currentOrganization || !currentUser) return;

        setIsSubmitting(true);
        const result = await mockApi.users.deactivate(
            selectedUser.id,
            currentOrganization.id,
            currentUser.id,
            currentUser.name
        );
        setIsSubmitting(false);

        if (result.success) {
            addToast(`${selectedUser.name} has been deactivated`, 'success');
            setIsDeactivateOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } else {
            addToast(result.error || 'Failed to deactivate user', 'error');
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Team Members</h2>
                        <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                            Manage access and roles
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleInvite}
                        disabled={!canInvite}
                        title={!canInvite ? getPermissionDeniedMessage('user.invite') : undefined}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        Invite User
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left' }}>User</th>
                                <th style={{ textAlign: 'left' }}>Role</th>
                                <th style={{ textAlign: 'left' }}>Email</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <>
                                    <TableRowSkeleton columns={4} />
                                    <TableRowSkeleton columns={4} />
                                    <TableRowSkeleton columns={4} />
                                </>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'var(--slate-200)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--slate-600)',
                                                        fontWeight: 600,
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                                                    {user.name}
                                                    {user.id === currentUser?.id && (
                                                        <span style={{ fontSize: '11px', color: 'var(--foreground-muted)', marginLeft: '6px' }}>
                                                            (You)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {canChangeRole && user.id !== currentUser?.id ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '6px',
                                                        backgroundColor: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <option value="viewer">Viewer</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--foreground-muted)' }}>{user.email}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    className="btn btn-ghost"
                                                    style={{
                                                        fontSize: '13px',
                                                        color: canDeactivate ? 'var(--red-500)' : 'var(--slate-300)'
                                                    }}
                                                    onClick={() => handleDeactivateClick(user)}
                                                    disabled={!canDeactivate}
                                                    title={!canDeactivate ? getPermissionDeniedMessage('user.deactivate') : 'Deactivate user'}
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!isLoading && users.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
                                        No team members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            <InviteUserModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSubmit={handleInviteSubmit}
            />

            {/* Deactivate Confirmation */}
            <ConfirmDialog
                isOpen={isDeactivateOpen}
                onClose={() => setIsDeactivateOpen(false)}
                onConfirm={handleDeactivateConfirm}
                title="Deactivate User"
                message={`Are you sure you want to deactivate ${selectedUser?.name}? They will lose access to this organization.`}
                confirmText="Deactivate"
                variant="danger"
                isLoading={isSubmitting}
            />
        </>
    );
}
