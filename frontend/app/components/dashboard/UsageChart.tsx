'use client';

import React, { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { usageTrendData, UsageDataPoint } from '../../lib/mockData';

export function UsageChart() {
  const { currentOrganization, loading: tenantLoading } = useTenant();
  const [days, setDays] = useState(7);

  // Use mock data based on current organization
  const orgId = currentOrganization?.id || 'org_1';
  const data: UsageDataPoint[] = usageTrendData[orgId] || usageTrendData['org_1'];

  const chartDimensions = useMemo(() => {
    const width = 600;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    return { width, height, padding, chartWidth, chartHeight };
  }, []);

  const { width, height, padding, chartWidth, chartHeight } = chartDimensions;

  const scales = useMemo(() => {
    if (data.length === 0) {
      return { xScale: () => 0, yScale: () => chartHeight, maxValue: 100, minValue: 0, valueRange: 100 };
    }

    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1;
    const minValue = Math.min(...data.map((d) => d.value)) * 0.9;
    const valueRange = maxValue - minValue || 1;

    const xScale = (index: number) => (index / Math.max(data.length - 1, 1)) * chartWidth;
    const yScale = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

    return { xScale, yScale, maxValue, minValue, valueRange };
  }, [data, chartWidth, chartHeight]);

  const linePath = useMemo(() => {
    if (data.length === 0) return '';
    return data
      .map((d, i) => {
        const x = scales.xScale(i);
        const y = scales.yScale(d.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [data, scales]);

  const areaPath = useMemo(() => {
    if (!linePath) return '';
    return `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  }, [linePath, chartWidth, chartHeight]);

  const yTicks = 5;
  const tickValues = useMemo(() => {
    if (data.length === 0) return [];
    const { maxValue, minValue, valueRange } = scales;
    return Array.from({ length: yTicks }, (_, i) => minValue + (valueRange * i) / (yTicks - 1));
  }, [data, scales]);

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toFixed(0);
  };

  if (tenantLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
            Usage Trend
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
            API requests over the last {days} days
          </p>
        </div>
        <div className="card-body">
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--foreground-muted)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
            Usage Trend
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
            API requests over the last {days} days
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${days === 7 ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ padding: '6px 10px', fontSize: '13px' }}
            onClick={() => setDays(7)}
          >
            7 Days
          </button>
          <button
            className={`btn ${days === 30 ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ padding: '6px 10px', fontSize: '13px' }}
            onClick={() => setDays(30)}
          >
            30 Days
          </button>
        </div>
      </div>
      <div className="card-body">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--blue-500)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--blue-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {tickValues.map((tick, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={scales.yScale(tick)}
                  x2={chartWidth}
                  y2={scales.yScale(tick)}
                  className="chart-grid-line"
                  strokeDasharray="4,4"
                />
                <text
                  x={-10}
                  y={scales.yScale(tick)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="chart-axis-label"
                >
                  {formatValue(tick)}
                </text>
              </g>
            ))}

            {data.map((d, i) => (
              <text
                key={i}
                x={scales.xScale(i)}
                y={chartHeight + 20}
                textAnchor="middle"
                className="chart-axis-label"
              >
                {d.date.split(' ')[1]}
              </text>
            ))}

            <path d={areaPath} fill="url(#areaGradient)" />

            <path d={linePath} className="chart-line" />

            {data.map((d, i) => (
              <circle
                key={i}
                cx={scales.xScale(i)}
                cy={scales.yScale(d.value)}
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
