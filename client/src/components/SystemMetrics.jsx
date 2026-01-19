import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SystemMetrics({ metrics, type }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!metrics) return;

        setHistory(prev => {
            const newPoint = {
                time: new Date().toLocaleTimeString(),
                cpu: parseFloat(metrics.cpu.load),
                memory: Math.round((metrics.memory.active / metrics.memory.total) * 100)
            };
            // Keep last 60 points (1-2 minutes history)
            const newHistory = [...prev, newPoint];
            if (newHistory.length > 60) newHistory.shift();
            return newHistory;
        });
    }, [metrics]);

    const renderCpu = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3>CPU Usage</h3>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="metric-value" style={{ margin: '0' }}>{metrics?.cpu?.load || 0}%</div>
                <div className="metric-label">{metrics?.cpu?.brand || 'Loading...'}</div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cpu"
                            stroke="#38bdf8"
                            fillOpacity={1}
                            fill="url(#colorCpu)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    const renderMemory = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3>Memory Usage</h3>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="metric-value" style={{ margin: '0' }}>
                    {metrics ? Math.round((metrics.memory.active / metrics.memory.total) * 100) : 0}%
                </div>
                <div className="metric-label">
                    {metrics ? `${(metrics.memory.used / 1073741824).toFixed(1)}GB / ${(metrics.memory.total / 1073741824).toFixed(1)}GB` : 'Loading...'}
                </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="memory"
                            stroke="#a855f7"
                            fillOpacity={1}
                            fill="url(#colorMem)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    if (type === 'cpu') return renderCpu();
    if (type === 'memory') return renderMemory();

    // Fallback if no type specified (show both in fragments - though layout might break in grid)
    return (
        <>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>{renderCpu()}</div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>{renderMemory()}</div>
        </>
    );
}
