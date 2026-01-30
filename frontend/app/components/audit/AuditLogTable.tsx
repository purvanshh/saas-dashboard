'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useToast } from '../../contexts/ToastContext';
import { mockApi } from '../../lib/mockApi';
import { AuditLogEntry } from '../../lib/mockDb';
import { TableRowSkeleton } from '../ui/Skeleton';

// Action color mapping
const getActionColor = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created') || actionLower.includes('invited')) return 'var(--emerald-600)';
    if (actionLower.includes('deleted') || actionLower.includes('deactivated')) return 'var(--red-600)';
    if (actionLower.includes('updated') || actionLower.includes('changed')) return 'var(--blue-600)';
    return 'var(--slate-600)';
};

const getActionBgColor = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created') || actionLower.includes('invited')) return 'var(--emerald-50)';
    if (actionLower.includes('deleted') || actionLower.includes('deactivated')) return 'var(--red-50)';
    if (actionLower.includes('updated') || actionLower.includes('changed')) return 'var(--blue-50)';
    return 'var(--slate-100)';
};

export function AuditLogTable() {
    const { currentOrganization } = useTenant();
    const { addToast } = useToast();

    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    // Fetch logs
    const fetchLogs = useCallback(async () => {
        if (!currentOrganization) return;
        setIsLoading(true);
        const result = await mockApi.audit.list(currentOrganization.id);
        if (result.success && result.data) {
            setLogs(result.data);
        }
        setIsLoading(false);
    }, [currentOrganization]);

    useEffect(() => {
        setTimeout(() => fetchLogs(), 0);
    }, [fetchLogs]);

    // Filter logs
    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.action.toLowerCase().includes(filter.toLowerCase()));

    // Get unique actions for filter
    const uniqueActions = [...new Set(logs.map(log => log.action))];

    const handleExport = () => {
        // Create CSV content
        const headers = ['Timestamp', 'User', 'Action', 'Target'];
        const rows = logs.map(log => [log.timestamp, log.userName, log.action, log.target]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

        // Create and download blob
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${currentOrganization?.slug || 'export'}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        addToast('Audit logs exported successfully', 'success');
    };

    return (
        <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>System Audit Logs</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Filter dropdown */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                        }}
                    >
                        <option value="all">All Actions</option>
                        {uniqueActions.map(action => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>

                    {/* Export button */}
                    <button
                        className="btn btn-secondary"
                        onClick={handleExport}
                        disabled={logs.length === 0}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>User</th>
                            <th style={{ textAlign: 'left' }}>Action</th>
                            <th style={{ textAlign: 'left' }}>Target</th>
                            <th style={{ textAlign: 'right' }}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <>
                                <TableRowSkeleton columns={4} />
                                <TableRowSkeleton columns={4} />
                                <TableRowSkeleton columns={4} />
                                <TableRowSkeleton columns={4} />
                            </>
                        ) : filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--foreground-muted)' }}>
                                    {filter === 'all' ? 'No audit logs found.' : `No logs matching "${filter}".`}
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--blue-100)',
                                                    color: 'var(--blue-600)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '11px',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {log.userName.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{log.userName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            color: getActionColor(log.action),
                                            backgroundColor: getActionBgColor(log.action),
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--foreground)' }}>{log.target}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--foreground-muted)', fontSize: '13px' }}>
                                        {log.timestamp}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary footer */}
            {!isLoading && logs.length > 0 && (
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '13px',
                    color: 'var(--foreground-muted)',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <span>
                        Showing {filteredLogs.length} of {logs.length} entries
                    </span>
                    <span>
                        Last activity: {logs[0]?.timestamp || 'N/A'}
                    </span>
                </div>
            )}
        </div>
    );
}
