'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { currentUser } = useAuth();
    const { currentOrganization } = useTenant();
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        bio: 'Senior Product Manager with 8+ years of experience in SaaS platforms. Passionate about user experience and data-driven decision making.',
        location: 'San Francisco, CA',
        timezone: 'Pacific Standard Time (PST)',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/sarahchen',
        github: 'https://github.com/sarahchen',
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        marketingEmails: false,
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
    });

    if (!isOpen) return null;

    const handleSave = () => {
        // Simulate API call
        setTimeout(() => {
            setIsEditing(false);
            // Show success toast
        }, 500);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        >
                            {getInitials(currentUser?.name || 'User')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h2>
                            <p className="text-gray-600">{currentUser?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`badge badge-${currentUser?.role}`}>
                                    {currentUser?.role}
                                </span>
                                <span className="text-sm text-gray-500">at {currentOrganization?.name}</span>
                            </div>
                        </div>
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
                                { id: 'profile', label: 'Profile', icon: 'user' },
                                { id: 'preferences', label: 'Preferences', icon: 'settings' },
                                { id: 'security', label: 'Security', icon: 'shield' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-orange-100 text-orange-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {tab.icon === 'user' && <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />}
                                        {tab.icon === 'settings' && <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />}
                                        {tab.icon === 'shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Quick Stats */}
                        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-medium">Jan 2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Projects</span>
                                    <span className="font-medium">12</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last login</span>
                                    <span className="font-medium">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 max-h-[calc(85vh-88px)] overflow-y-auto">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="btn btn-secondary"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <p className="text-gray-900">{formData.location}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            LinkedIn
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                                                {formData.linkedin}
                                            </a>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            GitHub
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                className="input"
                                            />
                                        ) : (
                                            <a href={formData.github} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                                                {formData.github}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                            className="input"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.bio}</p>
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

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900">Preferences</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                                                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                                                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports' },
                                                { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and tips' },
                                            ].map((pref) => (
                                                <div key={pref.key} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{pref.label}</p>
                                                        <p className="text-sm text-gray-600">{pref.description}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={preferences[pref.key as keyof typeof preferences] as boolean}
                                                            onChange={(e) => setPreferences({ ...preferences, [pref.key]: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-4">Display</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Theme
                                                </label>
                                                <select
                                                    value={preferences.theme}
                                                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="auto">Auto</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Language
                                                </label>
                                                <select
                                                    value={preferences.language}
                                                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="es">Spanish</option>
                                                    <option value="fr">French</option>
                                                    <option value="de">German</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date Format
                                                </label>
                                                <select
                                                    value={preferences.dateFormat}
                                                    onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Time Format
                                                </label>
                                                <select
                                                    value={preferences.timeFormat}
                                                    onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="12h">12 Hour</option>
                                                    <option value="24h">24 Hour</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="btn btn-primary">
                                        Save Preferences
                                    </button>
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
                                                <p className="font-medium text-green-900">Account Secure</p>
                                                <p className="text-sm text-green-700">Your account security is up to date</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-4">Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input type="password" className="input" placeholder="Enter current password" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password
                                                </label>
                                                <input type="password" className="input" placeholder="Enter new password" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input type="password" className="input" placeholder="Confirm new password" />
                                            </div>
                                            <button className="btn btn-primary">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Authenticator App</p>
                                                <p className="text-sm text-gray-600">Use an authenticator app to generate codes</p>
                                            </div>
                                            <button className="btn btn-secondary">
                                                Enable
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
                                        <div className="space-y-3">
                                            {[
                                                { device: 'MacBook Pro', location: 'San Francisco, CA', current: true, lastActive: 'Active now' },
                                                { device: 'iPhone 15', location: 'San Francisco, CA', current: false, lastActive: '2 hours ago' },
                                                { device: 'Chrome on Windows', location: 'New York, NY', current: false, lastActive: '1 day ago' },
                                            ].map((session, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                                                <line x1="8" y1="21" x2="16" y2="21" />
                                                                <line x1="12" y1="17" x2="12" y2="21" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {session.device}
                                                                {session.current && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Current</span>}
                                                            </p>
                                                            <p className="text-sm text-gray-600">{session.location} • {session.lastActive}</p>
                                                        </div>
                                                    </div>
                                                    {!session.current && (
                                                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                            Revoke
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
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