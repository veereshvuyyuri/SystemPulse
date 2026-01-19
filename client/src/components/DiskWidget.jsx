import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DiskWidget({ disk }) {
    if (!disk) return <div>Loading...</div>;

    const data = [
        { name: 'Used', value: disk.used },
        { name: 'Free', value: disk.size - disk.used },
    ];

    const COLORS = ['#f472b6', 'rgba(255,255,255,0.1)'];

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ width: '100%', textAlign: 'left' }}>Disk Usage ({disk.fs})</h3>

            <div style={{ flex: 1, width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => formatBytes(value)}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(disk.use)}%</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Used</div>
                </div>
            </div>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Free: {formatBytes(disk.size - disk.used)}</span>
                <span>Total: {formatBytes(disk.size)}</span>
            </div>
        </div>
    );
}
