import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProcessList({ processes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSystem, setShowSystem] = useState(false);

    const systemProcessNames = [
        'System', 'System Idle Process', 'Registry', 'smss.exe', 'csrss.exe',
        'wininit.exe', 'services.exe', 'lsass.exe', 'svchost.exe', 'winlogon.exe',
        'fontdrvhost.exe', 'dwm.exe', 'spoolsv.exe', 'dasHost.exe', 'sihost.exe',
        'taskhostw.exe', 'RuntimeBroker.exe', 'SearchIndexer.exe', 'ShellExperienceHost.exe'
    ];

    const filteredProcesses = (processes || []).filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.pid.toString().includes(searchTerm);

        const isSystem = systemProcessNames.some(name => p.name.toLowerCase() === name.toLowerCase() || p.name === 'System');

        // If system filter is ON (showSystem is false), hide system processes UNLESS specifically searched for
        if (!showSystem && isSystem && !searchTerm) return false;

        return matchesSearch;
    });

    const top10Processes = [...filteredProcesses].sort((a, b) => b.cpu - a.cpu).slice(0, 10);

    const formatTime = (started) => {
        if (!started) return '-';
        return started.split(' ')[1] || started;
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2', maxHeight: '800px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Top Processes</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowSystem(!showSystem)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary, #38bdf8)',
                            textDecoration: 'underline',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        {showSystem ? "Hide System" : "Show System"}
                    </button>
                    <input
                        type="text"
                        placeholder="Search process..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.8rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

            {/* Top 10 Processes Chart */}
            <div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
                <ResponsiveContainer>
                    <BarChart data={top10Processes} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                            itemStyle={{ color: '#f8fafc' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="cpu" fill="#38bdf8" radius={[0, 4, 4, 0]}>
                            {top10Processes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f472b6' : '#38bdf8'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ overflowY: 'auto', paddingRight: '0.5rem', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
                        <tr style={{ textAlign: 'left', color: 'var(--text-secondary)' }}>
                            <th style={{ paddingBottom: '0.5rem' }}>Name</th>
                            <th style={{ paddingBottom: '0.5rem' }}>PID</th>
                            <th style={{ paddingBottom: '0.5rem' }}>CPU%</th>
                            <th style={{ paddingBottom: '0.5rem' }}>MEM%</th>
                            <th style={{ paddingBottom: '0.5rem' }}>Started</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcesses.length > 0 ? (
                            filteredProcesses.map((p, index) => (
                                <tr key={`${p.pid}-${index}`} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.5rem 0', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{p.pid}</td>

                                    {/* CPU Bar Column */}
                                    <td style={{ width: '25%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ color: 'var(--accent-color, #38bdf8)', minWidth: '35px' }}>{p.cpu}%</span>
                                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                <div style={{
                                                    width: `${Math.min(parseFloat(p.cpu), 100)}%`,
                                                    height: '100%',
                                                    background: 'var(--accent-color, #38bdf8)',
                                                    borderRadius: '2px',
                                                    transition: 'width 0.5s ease'
                                                }} />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Memory Bar Column */}
                                    <td style={{ width: '25%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ minWidth: '35px' }}>{p.mem}%</span>
                                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                <div style={{
                                                    width: `${Math.min(parseFloat(p.mem), 100)}%`,
                                                    height: '100%',
                                                    background: '#a855f7',
                                                    borderRadius: '2px',
                                                    transition: 'width 0.5s ease'
                                                }} />
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ color: 'var(--text-secondary)' }}>{formatTime(p.started)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No processes found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
