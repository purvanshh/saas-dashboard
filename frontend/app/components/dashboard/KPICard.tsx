'use client';

import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface KPICardProps {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    unit?: string;
    icon: React.ReactNode;
    index?: number;
}

export function KPICard({ title, value, change, trend, unit, icon, index = 0 }: KPICardProps) {
    const { elementRef, isVisible } = useScrollAnimation({ 
        delay: index * 150,
        threshold: 0.2 
    });

    const getTrendColor = () => {
        if (trend === 'up') return 'var(--emerald-600)';
        if (trend === 'down') return 'var(--red-600)';
        return 'var(--slate-500)';
    };

    const getTrendBgColor = () => {
        if (trend === 'up') return 'var(--emerald-50)';
        if (trend === 'down') return 'var(--red-50)';
        return 'var(--slate-50)';
    };

    const getTrendIcon = () => {
        if (trend === 'up') {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            );
        }
        if (trend === 'down') {
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            );
        }
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
            </svg>
        );
    };

    // Determine if the trend is positive or negative based on context
    const isPositive = title.toLowerCase().includes('error')
        ? trend === 'down'
        : trend === 'up';

    return (
        <div 
            ref={elementRef}
            className={`card glow-hover ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            style={{ 
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--background-card) 0%, rgba(248, 250, 252, 0.8) 100%)',
                animationDelay: `${index * 150}ms`,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            {/* Premium gradient top border */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${getTrendColor()}, transparent)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease-out',
                    transitionDelay: `${index * 150 + 300}ms`,
                }}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p 
                        className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                        style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--foreground-muted)',
                            marginBottom: '12px',
                            animationDelay: `${index * 150 + 100}ms`,
                        }}
                    >
                        {title}
                    </p>
                    <p 
                        className={`text-gradient ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}
                        style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            margin: 0,
                            letterSpacing: '-0.02em',
                            animationDelay: `${index * 150 + 200}ms`,
                        }}
                    >
                        {typeof value === 'number' ? value.toLocaleString() : value}
                        {unit && (
                            <span style={{ 
                                fontSize: '18px', 
                                fontWeight: 500, 
                                marginLeft: '4px',
                                opacity: 0.8 
                            }}>
                                {unit}
                            </span>
                        )}
                    </p>
                </div>

                {/* Enhanced icon container with floating animation */}
                <div 
                    className={`animate-float ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-lg)',
                        background: getTrendBgColor(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getTrendColor(),
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        animationDelay: `${index * 150 + 300}ms`,
                    }}
                >
                    {icon}
                </div>
            </div>

            {/* Enhanced trend indicator */}
            <div 
                className={`${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '16px',
                    animationDelay: `${index * 150 + 400}ms`,
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: getTrendBgColor(),
                    color: isPositive ? 'var(--emerald-600)' : getTrendColor(),
                    fontSize: '13px',
                    fontWeight: 600,
                }}>
                    <div className={isPositive ? 'animate-pulse-glow' : ''}>
                        {getTrendIcon()}
                    </div>
                    {Math.abs(change)}%
                </div>
                <span style={{
                    fontSize: '13px',
                    color: 'var(--foreground-muted)',
                    fontWeight: 400,
                }}>
                    vs last month
                </span>
            </div>

            {/* Floating accent dot for premium feel */}
            <div
                className={`animate-float ${isVisible ? '' : 'opacity-0'}`}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: getTrendColor(),
                    opacity: 0.3,
                    animationDelay: `${index * 150 + 500}ms`,
                }}
            />
        </div>
    );
}
