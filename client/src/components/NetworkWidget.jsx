import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function NetworkWidget({ network }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!network) return;

        setHistory(prev => {
            const newPoint = {
                time: new Date().toLocaleTimeString(),
                rx: network.rx_sec / 1024, // KB/s
                tx: network.tx_sec / 1024  // KB/s
            };
            const newHistory = [...prev, newPoint];
            if (newHistory.length > 60) newHistory.shift();
            return newHistory;
        });
    }, [network]);

    const formatSpeed = (kbs) => {
        if (kbs > 1024) return `${(kbs / 1024).toFixed(1)} MB/s`;
        return `${Math.round(kbs)} KB/s`;
    };

    const currentRx = network ? network.rx_sec / 1024 : 0;
    const currentTx = network ? network.tx_sec / 1024 : 0;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3>Network Traffic</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '0.5rem 0' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>▼ Download</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatSpeed(currentRx)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f87171' }}>▲ Upload</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatSpeed(currentTx)}</div>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value, name) => [
                                `${value.toFixed(1)} KB/s`,
                                name === 'rx' ? 'Download' : 'Upload'
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="rx"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="tx"
                            stroke="#f87171"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
