'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useToast } from '../../contexts/ToastContext';

interface AdminActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    actionType: 'invite' | 'export' | 'report' | 'settings' | 'billing' | 'backup' | 'integrations' | 'audit';
}

export function AdminActionsModal({ isOpen, onClose, actionType }: AdminActionsModalProps) {
    const { currentUser } = useAuth();
    const { currentOrganization } = useTenant();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Invite User State
    const [inviteData, setInviteData] = useState({
        email: '',
        name: '',
        role: 'viewer' as 'admin' | 'manager' | 'viewer',
        message: 'Welcome to our team! You\'ve been invited to join our organization.'
    });

    // Export Data State
    const [exportData, setExportData] = useState({
        type: 'analytics' as 'analytics' | 'users' | 'projects' | 'audit' | 'billing',
        format: 'csv' as 'csv' | 'json' | 'pdf',
        dateRange: '30days' as '7days' | '30days' | '90days' | 'custom',
        includeDeleted: false
    });

    // Report Generation State
    const [reportData, setReportData] = useState({
        type: 'performance' as 'performance' | 'usage' | 'security' | 'custom',
        recipients: [currentUser?.email || ''],
        schedule: 'once' as 'once' | 'weekly' | 'monthly',
        includeCharts: true,
        includeRawData: false
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setSuccess(true);
        setLoading(false);

        // Show success toast
        const successMessages = {
            invite: `Invitation sent to ${inviteData.email}`,
            export: 'Data export started. You\'ll receive an email when ready.',
            report: 'Report generation started. You\'ll receive it via email.',
            backup: 'Backup process initiated successfully',
            settings: 'Settings updated successfully',
            billing: 'Billing information updated',
            integrations: 'Integration configured successfully',
            audit: 'Audit log exported successfully'
        };

        addToast(successMessages[actionType] || 'Action completed successfully', 'success');

        // Auto close after success
        setTimeout(() => {
            setSuccess(false);
            onClose();
        }, 2000);
    };

    const getModalTitle = () => {
        switch (actionType) {
            case 'invite': return 'Invite Team Member';
            case 'export': return 'Export Data';
            case 'report': return 'Generate Report';
            case 'settings': return 'Organization Settings';
            case 'billing': return 'Billing & Subscription';
            case 'backup': return 'Backup Data';
            case 'integrations': return 'Manage Integrations';
            case 'audit': return 'Audit Logs';
            default: return 'Admin Action';
        }
    };

    const renderContent = () => {
        if (success) {
            return (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600">
                        {actionType === 'invite' && 'Invitation sent successfully'}
                        {actionType === 'export' && 'Data export started. You\'ll receive an email when ready.'}
                        {actionType === 'report' && 'Report generation started. You\'ll receive it via email.'}
                        {actionType === 'backup' && 'Backup process initiated successfully'}
                    </p>
                </div>
            );
        }

        switch (actionType) {
            case 'invite':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                    className="input"
                                    placeholder="colleague@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteData.name}
                                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                value={inviteData.role}
                                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as any })}
                                className="input"
                            >
                                <option value="viewer">Viewer - Can view data and reports</option>
                                <option value="manager">Manager - Can manage projects and users</option>
                                <option value="admin">Admin - Full access to organization</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Welcome Message
                            </label>
                            <textarea
                                value={inviteData.message}
                                onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                                rows={3}
                                className="input"
                                placeholder="Add a personal welcome message..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        Sending Invitation...
                                    </>
                                ) : (
                                    'Send Invitation'
                                )}
                            </button>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                );

            case 'export':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data Type
                                </label>
                                <select
                                    value={exportData.type}
                                    onChange={(e) => setExportData({ ...exportData, type: e.target.value as any })}
                                    className="input"
                                >
                                    <option value="analytics">Analytics & Metrics</option>
                                    <option value="users">User Data</option>
                                    <option value="projects">Project Data</option>
                                    <option value="audit">Audit Logs</option>
                                    <option value="billing">Billing History</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Format
                                </label>
                                <select
                                    value={exportData.format}
                                    onChange={(e) => setExportData({ ...exportData, format: e.target.value as any })}
                                    className="input"
                                >
                                    <option value="csv">CSV</option>
                                    <option value="json">JSON</option>
                                    <option value="pdf">PDF Report</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date Range
                            </label>
                            <select
                                value={exportData.dateRange}
                                onChange={(e) => setExportData({ ...exportData, dateRange: e.target.value as any })}
                                className="input"
                            >
                                <option value="7days">Last 7 days</option>
                                <option value="30days">Last 30 days</option>
                                <option value="90days">Last 90 days</option>
                                <option value="custom">Custom range</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="includeDeleted"
                                checked={exportData.includeDeleted}
                                onChange={(e) => setExportData({ ...exportData, includeDeleted: e.target.checked })}
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="includeDeleted" className="text-sm text-gray-700">
                                Include deleted/archived items
                            </label>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 mt-0.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Export Information</p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Large exports may take several minutes to process. You'll receive an email with the download link when ready.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        Processing Export...
                                    </>
                                ) : (
                                    'Start Export'
                                )}
                            </button>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                );

            case 'report':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Report Type
                            </label>
                            <select
                                value={reportData.type}
                                onChange={(e) => setReportData({ ...reportData, type: e.target.value as any })}
                                className="input"
                            >
                                <option value="performance">Performance Summary</option>
                                <option value="usage">Usage Analytics</option>
                                <option value="security">Security Report</option>
                                <option value="custom">Custom Report</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipients
                            </label>
                            <input
                                type="email"
                                value={reportData.recipients.join(', ')}
                                onChange={(e) => setReportData({ ...reportData, recipients: e.target.value.split(', ') })}
                                className="input"
                                placeholder="email1@company.com, email2@company.com"
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate multiple emails with commas</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Schedule
                            </label>
                            <select
                                value={reportData.schedule}
                                onChange={(e) => setReportData({ ...reportData, schedule: e.target.value as any })}
                                className="input"
                            >
                                <option value="once">Generate once</option>
                                <option value="weekly">Weekly (every Monday)</option>
                                <option value="monthly">Monthly (1st of month)</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="includeCharts"
                                    checked={reportData.includeCharts}
                                    onChange={(e) => setReportData({ ...reportData, includeCharts: e.target.checked })}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="includeCharts" className="text-sm text-gray-700">
                                    Include charts and visualizations
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="includeRawData"
                                    checked={reportData.includeRawData}
                                    onChange={(e) => setReportData({ ...reportData, includeRawData: e.target.checked })}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="includeRawData" className="text-sm text-gray-700">
                                    Include raw data tables
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        Generating Report...
                                    </>
                                ) : (
                                    'Generate Report'
                                )}
                            </button>
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                );

            case 'backup':
                return (
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600 mt-0.5">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-yellow-900">Important</p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This will create a complete backup of your organization's data. The process may take several minutes.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Backup will include:</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    All user accounts and permissions
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Project data and configurations
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Analytics and usage data
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Organization settings and integrations
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Audit logs and security events
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn btn-primary flex-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner" />
                                        Creating Backup...
                                    </>
                                ) : (
                                    'Start Backup'
                                )}
                            </button>
                            <button onClick={onClose} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-8">
                        <p className="text-gray-600">This feature is coming soon!</p>
                        <button onClick={onClose} className="btn btn-secondary mt-4">
                            Close
                        </button>
                    </div>
                );
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{getModalTitle()}</h2>
                        <p className="text-sm text-gray-600 mt-1">{currentOrganization?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[calc(90vh-88px)] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}