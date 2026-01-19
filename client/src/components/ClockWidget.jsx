import { useState, useEffect } from 'react';

export default function ClockWidget() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Time Display */}
            <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                <span style={{
                    fontSize: '4.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to bottom, #f8fafc, #94a3b8)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-2px',
                    filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.3))'
                }}>
                    {hours}:{minutes}
                </span>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#38bdf8',
                    marginLeft: '0.5rem',
                    textShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                }}>
                    {seconds}
                </span>
            </div>

            {/* Date Badge */}
            <div style={{
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '20px',
                color: '#bae6fd',
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
                {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>

        </div >
    );
}
