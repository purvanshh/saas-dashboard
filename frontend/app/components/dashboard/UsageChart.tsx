'use client';

import React, { useState, useMemo } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { usageTrendData, UsageDataPoint } from '../../lib/mockData';

export function UsageChart() {
  const { currentOrganization, loading: tenantLoading } = useTenant();
  const [days, setDays] = useState(7);

  // Use mock data based on current organization
  const orgId = currentOrganization?.id || 'org_1';
  const allData: UsageDataPoint[] = usageTrendData[orgId] || usageTrendData['org_1'];
  
  // Filter data based on selected time period
  const data = useMemo(() => {
    if (days === 7) {
      // Return last 7 days
      return allData.slice(-7);
    } else {
      // Return all 30 days
      return allData;
    }
  }, [allData, days]);

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
    const { minValue, valueRange } = scales;
    return Array.from({ length: yTicks }, (_, i) => minValue + (valueRange * i) / (yTicks - 1));
  }, [data, scales]);

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toFixed(0);
  };

  const formatDateLabel = (dateStr: string, index: number) => {
    if (days === 7) {
      // For 7 days, show day abbreviation
      return dateStr.split(' ')[1] || `D${index + 1}`;
    } else {
      // For 30 days, show fewer labels to avoid crowding
      if (index % 5 === 0 || index === data.length - 1) {
        return dateStr.split(' ')[1] || `D${index + 1}`;
      }
      return '';
    }
  };

  if (tenantLoading) {
    return (
      <div className="card animate-slide-in-up animate-delay-200">
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
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-in-up animate-delay-200">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
            Usage Trend
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--foreground-muted)', margin: '4px 0 0 0' }}>
            API requests over the last {days} days • {data.length} data points
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${days === 7 ? 'btn-primary' : 'btn-ghost'} glow-hover`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '13px',
              transition: 'all var(--micro-duration) var(--micro-easing)',
            }}
            onClick={() => setDays(7)}
          >
            7 Days
          </button>
          <button
            className={`btn ${days === 30 ? 'btn-primary' : 'btn-ghost'} glow-hover`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '13px',
              transition: 'all var(--micro-duration) var(--micro-easing)',
            }}
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
            <linearGradient id={`areaGradient-${orgId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {tickValues.map((tick, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={scales.yScale(tick)}
                  x2={chartWidth}
                  y2={scales.yScale(tick)}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
                <text
                  x={-10}
                  y={scales.yScale(tick)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="var(--foreground-muted)"
                  fontSize="11px"
                >
                  {formatValue(tick)}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => {
              const label = formatDateLabel(d.date, i);
              if (!label) return null;
              return (
                <text
                  key={i}
                  x={scales.xScale(i)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fill="var(--foreground-muted)"
                  fontSize="11px"
                >
                  {label}
                </text>
              );
            })}

            {/* Area fill */}
            <path 
              d={areaPath} 
              fill={`url(#areaGradient-${orgId})`}
              className="animate-scale-in"
            />

            {/* Line */}
            <path 
              d={linePath} 
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-slide-in-left"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.2))',
              }}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={scales.xScale(i)}
                cy={scales.yScale(d.value)}
                r="4"
                fill="var(--accent)"
                stroke="white"
                strokeWidth="2"
                className={`animate-scale-in animate-delay-${i * 50}`}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))',
                  cursor: 'pointer',
                }}
              >
                <title>{`${d.date}: ${formatValue(d.value)} requests`}</title>
              </circle>
            ))}
          </g>
        </svg>
        
        {/* Summary stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '16px',
          padding: '12px 0',
          borderTop: '1px solid var(--border)',
          fontSize: '13px',
          color: 'var(--foreground-muted)'
        }}>
          <span>
            <strong style={{ color: 'var(--foreground)' }}>
              {formatValue(Math.max(...data.map(d => d.value)))}
            </strong> peak
          </span>
          <span>
            <strong style={{ color: 'var(--foreground)' }}>
              {formatValue(data.reduce((sum, d) => sum + d.value, 0) / data.length)}
            </strong> average
          </span>
          <span>
            <strong style={{ color: 'var(--foreground)' }}>
              {formatValue(Math.min(...data.map(d => d.value)))}
            </strong> minimum
          </span>
        </div>
      </div>
    </div>
  );
}
