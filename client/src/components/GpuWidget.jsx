import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GpuWidget({ gpus }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!gpus || gpus.length === 0) return;

        // For now, we'll monitor the first GPU if multiple exist
        const mainGpu = gpus[0];

        setHistory(prev => {
            const newPoint = {
                time: new Date().toLocaleTimeString(),
                // systeminformation doesn't always provide 'load' for GPU easily without platform specific tools
                // but we can at least show the presence and static info, or dynamic load if we had it
                // Since si.graphics() controllers doesn't have load, we'll just show static info for now
                // and maybe a placeholder sparkline or just the details.
                // Let's assume we might get load in future or just show it's active.
                active: 1 // placeholder for "active" state
            };
            const newHistory = [...prev, newPoint];
            if (newHistory.length > 60) newHistory.shift();
            return newHistory;
        });
    }, [gpus]);

    if (!gpus || gpus.length === 0) {
        return (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No GPU detected
            </div>
        );
    }

    const mainGpu = gpus[0];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>GPU</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                    {mainGpu.model || 'Unknown Model'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {mainGpu.vendor || 'Unknown Vendor'}
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    VRAM: {mainGpu.vram || 'N/A'} MB {mainGpu.vramDynamic ? '(Dynamic)' : ''}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Live utilization monitoring coming soon
                </span>
            </div>
        </div>
    );
}
