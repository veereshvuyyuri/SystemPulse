import React, { useState } from 'react';

export default function ReportingModal({ isOpen, onClose }) {
    const [startDate, setStartDate] = useState(new Date(Date.now() - 3600000).toISOString().slice(0, 16)); // 1h ago
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const downloadReport = async () => {
        setLoading(true);
        setError(null);
        try {
            // Convert local time string to UTC ISO for the API
            const startStr = new Date(startDate).toISOString();
            const endStr = new Date(endDate).toISOString();

            const backendHost = window.location.hostname === 'localhost' ? 'localhost:3001' : `${window.location.hostname}:3001`;
            const response = await fetch(`https://${backendHost}/api/reports?start=${startStr}&end=${endStr}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch report');

            if (data.length === 0) {
                setError('No data found for the selected range.');
                return;
            }

            // Convert to CSV
            const headers = ['Timestamp', 'CPU Load (%)', 'Mem Used (GB)', 'Mem Total (GB)', 'Net Rx (KB/s)', 'Net Tx (KB/s)', 'Disk Used (GB)', 'Disk Total (GB)'];
            const rows = data.map(r => [
                r.timestamp,
                r.cpu_load,
                r.mem_used_gb,
                r.mem_total_gb,
                r.net_rx_kb,
                r.net_tx_kb,
                r.disk_used_gb,
                r.disk_total_gb
            ]);

            const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `system-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        }}>
            <div className="glass-panel" style={{
                width: '400px',
                padding: '2rem',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1rem', right: '1rem',
                    background: 'none', border: 'none', color: '#fff', cursor: 'pointer'
                }}>✕</button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>System Report</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Start Date</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>End Date</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff'
                            }}
                        />
                    </div>

                    {error && <div style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>}

                    <button
                        onClick={downloadReport}
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            marginTop: '1rem',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            background: 'var(--accent-primary)',
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Generating...' : 'Download CSV Report'}
                    </button>
                </div>
            </div>
        </div>
    );
}
