'use client';

import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectList } from '../components/projects/ProjectList';

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Projects</h1>
                </div>
                <ProjectList />
            </div>
        </DashboardLayout>
    );
}
