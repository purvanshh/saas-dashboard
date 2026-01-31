'use client';

import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

export function ProfileSettingsCard() {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Michael Torres',
        email: 'michael@acme.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/sarahchen',
        github: 'https://github.com/sarahchen',
        bio: 'Senior Product Manager with 8+ years of experience in SaaS platforms. Passionate about user experience and data-driven decision making.',
        memberSince: 'Jan 2025',
        projects: 12,
        lastLogin: '2 hours ago'
    });

    const handleSave = () => {
        setIsEditing(false);
        addToast('Profile updated successfully', 'success');
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '32px',
            maxWidth: '800px',
            width: '100%',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '600'
                    }}>
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            margin: '0 0 4px 0',
                            color: '#1f2937'
                        }}>
                            {profileData.name}
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#6b7280',
                            margin: 0
                        }}>
                            {profileData.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    style={{
                        backgroundColor: isEditing ? '#10b981' : '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px'
            }}>
                {/* Left Column */}
                <div>
                    {/* Quick Stats */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#6b7280' }}>🛡️</span>
                            Quick Stats
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Member since</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{profileData.memberSince}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Projects</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{profileData.projects}</div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Last login</div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{profileData.lastLogin}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px'
                        }}>
                            Contact Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{profileData.phone}</div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{profileData.location}</div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>LinkedIn</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={profileData.linkedin}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" style={{
                                            fontSize: '14px',
                                            color: '#f97316',
                                            textDecoration: 'none'
                                        }}>
                                            {profileData.linkedin}
                                        </a>
                                    )}
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>GitHub</label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            value={profileData.github}
                                            onChange={(e) => handleInputChange('github', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" style={{
                                            fontSize: '14px',
                                            color: '#f97316',
                                            textDecoration: 'none'
                                        }}>
                                            {profileData.github}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Bio Section */}
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px'
                        }}>
                            Bio
                        </h3>
                        {isEditing ? (
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        ) : (
                            <p style={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                color: '#4b5563',
                                margin: 0
                            }}>
                                {profileData.bio}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
                <div style={{
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={() => setIsEditing(false)}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
}