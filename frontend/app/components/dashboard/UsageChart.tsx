'use client';

import React from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { usageTrendData } from '../../lib/mockData';

export function UsageChart() {
    const { currentOrganization } = useTenant();
    const data = usageTrendData[currentOrganization.id] || usageTrendData['org_1'];

    // Chart dimensions
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
    const minValue = Math.min(...data.map((d) => d.value)) * 0.9;
    const valueRange = maxValue - minValue;

    const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Generate path
    const linePath = data
        .map((d, i) => {
            const x = xScale(i);
            const y = yScale(d.value);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');

    // Generate area path
    const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    // Y-axis ticks
    const yTicks = 5;
    const tickValues = Array.from({ length: yTicks }, (_, i) =>
        minValue + (valueRange * i) / (yTicks - 1)
    );

    const formatValue = (value: number) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
        }
        return value.toFixed(0);
    };

    return (
        <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
                        Usage Trend
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
                        API requests over the last 7 days
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '13px' }}>
                        7 Days
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '13px' }}>
                        30 Days
                    </button>
                </div>
            </div>
            <div className="card-body">
                <svg
                    width="100%"
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--blue-500)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--blue-500)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        {/* Grid lines */}
                        {tickValues.map((tick, i) => (
                            <g key={i}>
                                <line
                                    x1={0}
                                    y1={yScale(tick)}
                                    x2={chartWidth}
                                    y2={yScale(tick)}
                                    className="chart-grid-line"
                                    strokeDasharray="4,4"
                                />
                                <text
                                    x={-10}
                                    y={yScale(tick)}
                                    textAnchor="end"
                                    alignmentBaseline="middle"
                                    className="chart-axis-label"
                                >
                                    {formatValue(tick)}
                                </text>
                            </g>
                        ))}

                        {/* X-axis labels */}
                        {data.map((d, i) => (
                            <text
                                key={i}
                                x={xScale(i)}
                                y={chartHeight + 20}
                                textAnchor="middle"
                                className="chart-axis-label"
                            >
                                {d.date.split(' ')[1]}
                            </text>
                        ))}

                        {/* Area */}
                        <path d={areaPath} fill="url(#areaGradient)" />

                        {/* Line */}
                        <path d={linePath} className="chart-line" />

                        {/* Dots */}
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={xScale(i)}
                                cy={yScale(d.value)}
                                r="4"
                                className="chart-dot"
                            />
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
}
