'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { currentUser, hasPermission } = useAuth();
    const { currentOrganization } = useTenant();
    const [activeTab, setActiveTab] = useState<'general' | 'members' | 'billing' | 'integrations' | 'security'>('general');
    const [isEditing, setIsEditing] = useState(false);

    const [orgSettings, setOrgSettings] = useState({
        name: currentOrganization?.name || '',
        slug: currentOrganization?.slug || '',
        description: 'A leading technology company focused on innovative SaaS solutions.',
        website: 'https://acme.com',
        industry: 'Technology',
        size: '100-500',
        timezone: 'America/Los_Angeles',
        country: 'United States',
        allowPublicSignup: false,
        requireEmailVerification: true,
        enableSSO: true,
        sessionTimeout: '8h',
    });

    const [billingInfo] = useState({
        plan: currentOrganization?.plan || 'professional',
        nextBilling: 'February 28, 2026',
        paymentMethod: 'Visa ending in 4242',
        billingEmail: 'billing@acme.com',
        invoices: [
            { id: 'INV-2026-001', date: 'Jan 28, 2026', amount: 499, status: 'paid' as const },
            { id: 'INV-2025-012', date: 'Dec 28, 2025', amount: 499, status: 'paid' as const },
            { id: 'INV-2025-011', date: 'Nov 28, 2025', amount: 499, status: 'paid' as const },
        ]
    });

    const [integrations] = useState([
        { name: 'Slack', description: 'Team communication', status: 'connected', icon: '💬' },
        { name: 'GitHub', description: 'Code repository', status: 'connected', icon: '🐙' },
        { name: 'Jira', description: 'Project management', status: 'disconnected', icon: '📋' },
        { name: 'Google Workspace', description: 'Email and docs', status: 'connected', icon: '📧' },
        { name: 'Salesforce', description: 'CRM integration', status: 'disconnected', icon: '☁️' },
        { name: 'Stripe', description: 'Payment processing', status: 'connected', icon: '💳' },
    ]);

    if (!isOpen) return null;

    const handleSave = () => {
        // Simulate API call
        setTimeout(() => {
            setIsEditing(false);
            // Show success toast
        }, 500);
    };

    const canManageOrg = hasPermission('canManageOrg');
    const canManageBilling = hasPermission('canViewBilling');

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Organization Settings</h2>
                        <p className="text-gray-600">{currentOrganization?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-48 bg-gray-50 p-4">
                        <nav className="space-y-2">
                            {[
                                { id: 'general', label: 'General', icon: 'settings', permission: true },
                                { id: 'members', label: 'Members', icon: 'users', permission: canManageOrg },
                                { id: 'billing', label: 'Billing', icon: 'credit-card', permission: canManageBilling },
                                { id: 'integrations', label: 'Integrations', icon: 'link', permission: canManageOrg },
                                { id: 'security', label: 'Security', icon: 'shield', permission: canManageOrg },
                            ].filter(tab => tab.permission).map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {tab.icon === 'settings' && <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />}
                                        {tab.icon === 'users' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />}
                                        {tab.icon === 'credit-card' && <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />}
                                        {tab.icon === 'link' && <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />}
                                        {tab.icon === 'shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Plan Info */}
                        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-indigo-600 capitalize">{billingInfo.plan}</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                            <p className="text-sm text-gray-600">Next billing: {billingInfo.nextBilling}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 max-h-[calc(85vh-88px)] overflow-y-auto">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">General Settings</h3>
                                    {canManageOrg && (
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="btn btn-secondary"
                                        >
                                            {isEditing ? 'Cancel' : 'Edit Settings'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Organization Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={orgSettings.name}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, name: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{orgSettings.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL Slug
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={orgSettings.slug}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, slug: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{orgSettings.slug}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={orgSettings.website}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, website: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <a href={orgSettings.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                                                {orgSettings.website}
                                            </a>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={orgSettings.industry}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, industry: e.target.value })}
                                                className="input"
                                            >
                                                <option value="Technology">Technology</option>
                                                <option value="Healthcare">Healthcare</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Education">Education</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">{orgSettings.industry}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Size
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={orgSettings.size}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, size: e.target.value })}
                                                className="input"
                                            >
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-100">51-100 employees</option>
                                                <option value="100-500">100-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">{orgSettings.size} employees</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Timezone
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={orgSettings.timezone}
                                                onChange={(e) => setOrgSettings({ ...orgSettings, timezone: e.target.value })}
                                                className="input"
                                            >
                                                <option value="America/Los_Angeles">Pacific Time</option>
                                                <option value="America/Denver">Mountain Time</option>
                                                <option value="America/Chicago">Central Time</option>
                                                <option value="America/New_York">Eastern Time</option>
                                                <option value="Europe/London">GMT</option>
                                                <option value="Europe/Paris">CET</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-900">Pacific Time</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={orgSettings.description}
                                            onChange={(e) => setOrgSettings({ ...orgSettings, description: e.target.value })}
                                            rows={3}
                                            className="input"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{orgSettings.description}</p>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3">
                                        <button onClick={handleSave} className="btn btn-primary">
                                            Save Changes
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                                    <button className="btn btn-primary">
                                        Invite Member
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900">Active Members ({currentOrganization?.memberCount})</h4>
                                            <div className="flex gap-2">
                                                <input
                                                    type="search"
                                                    placeholder="Search members..."
                                                    className="input w-64"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {[
                                            { name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', status: 'active', joined: 'Jan 2025' },
                                            { name: 'Michael Torres', email: 'michael@acme.com', role: 'manager', status: 'active', joined: 'Jan 2025' },
                                            { name: 'Emily Watson', email: 'emily@acme.com', role: 'viewer', status: 'active', joined: 'Feb 2025' },
                                            { name: 'James Wilson', email: 'james@acme.com', role: 'viewer', status: 'pending', joined: 'Feb 2025' },
                                        ].map((member, index) => (
                                            <div key={index} className="px-6 py-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{member.name}</p>
                                                        <p className="text-sm text-gray-600">{member.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`badge badge-${member.role}`}>
                                                        {member.role}
                                                    </span>
                                                    <span className={`badge ${member.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                                        {member.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{member.joined}</span>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="1" />
                                                            <circle cx="12" cy="5" r="1" />
                                                            <circle cx="12" cy="19" r="1" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900">Billing & Subscription</h3>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Current Plan</h4>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900 capitalize">{billingInfo.plan}</p>
                                                    <p className="text-gray-600">$499/month • Billed monthly</p>
                                                </div>
                                                <button className="btn btn-secondary">
                                                    Change Plan
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Next billing date</p>
                                                    <p className="font-medium">{billingInfo.nextBilling}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Payment method</p>
                                                    <p className="font-medium">{billingInfo.paymentMethod}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-medium text-gray-900">Recent Invoices</h4>
                                                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                                    View All
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {billingInfo.invoices.map((invoice) => (
                                                    <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{invoice.id}</p>
                                                            <p className="text-sm text-gray-600">{invoice.date}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-medium">${invoice.amount}</span>
                                                            <span className="badge badge-success">Paid</span>
                                                            <button className="text-indigo-600 hover:text-indigo-700 text-sm">
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                                            <h4 className="font-medium text-indigo-900 mb-2">Usage This Month</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Active Users</span>
                                                        <span>1,284 / ∞</span>
                                                    </div>
                                                    <div className="w-full bg-indigo-200 rounded-full h-2">
                                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>Storage</span>
                                                        <span>847 GB / ∞</span>
                                                    </div>
                                                    <div className="w-full bg-indigo-200 rounded-full h-2">
                                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>API Calls</span>
                                                        <span>2.4M / ∞</span>
                                                    </div>
                                                    <div className="w-full bg-indigo-200 rounded-full h-2">
                                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Payment Method</h4>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                                    VISA
                                                </div>
                                                <div>
                                                    <p className="font-medium">•••• •••• •••• 4242</p>
                                                    <p className="text-sm text-gray-600">Expires 12/27</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-secondary w-full">
                                                Update Payment Method
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900">Integrations</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {integrations.map((integration, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl">{integration.icon}</div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{integration.name}</h4>
                                                        <p className="text-sm text-gray-600">{integration.description}</p>
                                                    </div>
                                                </div>
                                                <span className={`badge ${integration.status === 'connected' ? 'badge-success' : 'badge-warning'}`}>
                                                    {integration.status}
                                                </span>
                                            </div>
                                            <button className={`btn w-full ${integration.status === 'connected' ? 'btn-secondary' : 'btn-primary'}`}>
                                                {integration.status === 'connected' ? 'Configure' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Need a custom integration?</h4>
                                    <p className="text-gray-600 mb-4">
                                        Our API allows you to build custom integrations with your existing tools and workflows.
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="btn btn-primary">
                                            View API Docs
                                        </button>
                                        <button className="btn btn-secondary">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>

                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    <path d="M9 12l2 2 4-4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-900">Security Score: Excellent</p>
                                                <p className="text-sm text-green-700">Your organization follows security best practices</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Single Sign-On (SSO)</h4>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Enable SSO for your organization</p>
                                                    <p className="text-xs text-gray-500 mt-1">Requires Enterprise plan</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={orgSettings.enableSSO}
                                                        onChange={(e) => setOrgSettings({ ...orgSettings, enableSSO: e.target.checked })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                            <button className="btn btn-secondary w-full">
                                                Configure SSO
                                            </button>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Session Management</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Session Timeout
                                                    </label>
                                                    <select
                                                        value={orgSettings.sessionTimeout}
                                                        onChange={(e) => setOrgSettings({ ...orgSettings, sessionTimeout: e.target.value })}
                                                        className="input"
                                                    >
                                                        <option value="1h">1 hour</option>
                                                        <option value="4h">4 hours</option>
                                                        <option value="8h">8 hours</option>
                                                        <option value="24h">24 hours</option>
                                                        <option value="never">Never</option>
                                                    </select>
                                                </div>
                                                <button className="btn btn-secondary w-full">
                                                    Force Logout All Users
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Require Email Verification</p>
                                                        <p className="text-sm text-gray-600">New users must verify their email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={orgSettings.requireEmailVerification}
                                                            onChange={(e) => setOrgSettings({ ...orgSettings, requireEmailVerification: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Allow Public Signup</p>
                                                        <p className="text-sm text-gray-600">Anyone can join your organization</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={orgSettings.allowPublicSignup}
                                                            onChange={(e) => setOrgSettings({ ...orgSettings, allowPublicSignup: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-900 mb-4">Audit Logs</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Track all user actions and system events
                                            </p>
                                            <div className="flex gap-3">
                                                <button className="btn btn-secondary">
                                                    View Logs
                                                </button>
                                                <button className="btn btn-secondary">
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}