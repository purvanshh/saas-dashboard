'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext'; // Fix import path
import { useToast } from '../../contexts/ToastContext'; // Fix import path

export function OrgSettingsForm() {
    const { currentOrganization } = useTenant();
    const { addToast } = useToast();

    if (!currentOrganization) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* General Settings */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>General Settings</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Organization Name</label>
                            <input
                                type="text"
                                className="input"
                                defaultValue={currentOrganization.name}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Organization Slug</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--foreground-muted)', fontSize: '13px' }}>saasboard.com/</span>
                                <input
                                    type="text"
                                    className="input"
                                    defaultValue={currentOrganization.slug}
                                    disabled
                                    style={{ backgroundColor: 'var(--slate-50)' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Contact Email</label>
                            <input
                                type="email"
                                className="input"
                                defaultValue="admin@example.com"
                            />
                        </div>
                        <div style={{ paddingTop: '8px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => addToast('Organization settings saved', 'success')}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Notifications</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Email Alerts for Critical Errors', desc: 'Receive emails when error rate exceeds threshold', checked: true },
                            { label: 'Weekly Performance Report', desc: 'Summary of analytics sent every Monday', checked: true },
                            { label: 'New Member Notifications', desc: 'Notify when a new user joins the organization', checked: false }
                        ].map((item) => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    defaultChecked={item.checked}
                                    style={{ marginTop: '4px' }}
                                    onChange={() => addToast('Notification preference updated', 'info')}
                                />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</div>
                                    <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card" style={{ borderColor: 'var(--red-200)' }}>
                <div className="card-header" style={{ backgroundColor: 'var(--red-50)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--red-700)' }}>Danger Zone</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>Delete Organization</div>
                            <div style={{ fontSize: '13px', color: 'var(--foreground-muted)' }}>
                                Permanently delete this organization and all its data.
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ color: 'var(--red-600)', borderColor: 'var(--red-200)' }}
                            onClick={() => addToast('Action denied. Contact support to delete organization.', 'error')}
                        >
                            Delete Organization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
