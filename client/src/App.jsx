import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ClockWidget from './components/ClockWidget';
import WeatherWidget from './components/WeatherWidget';
import SystemMetrics from './components/SystemMetrics';
import ProcessList from './components/ProcessList';
import NetworkWidget from './components/NetworkWidget';
import DiskWidget from './components/DiskWidget';
import ReportingModal from './components/ReportingModal';

// Hook to get window width
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
// Define default layouts for all breakpoints
const defaultLayouts = {
  lg: [
    { i: 'cpu', x: 0, y: 0, w: 3, h: 4 },
    { i: 'memory', x: 3, y: 0, w: 3, h: 4 },
    { i: 'processes', x: 6, y: 0, w: 6, h: 12 },
    { i: 'network', x: 0, y: 4, w: 3, h: 4 },
    { i: 'disk', x: 3, y: 4, w: 3, h: 4 },
    { i: 'clock', x: 0, y: 8, w: 3, h: 4 },
    { i: 'weather', x: 3, y: 8, w: 3, h: 4 }
  ],
  md: [
    { i: 'cpu', x: 0, y: 0, w: 5, h: 4 },
    { i: 'memory', x: 5, y: 0, w: 5, h: 4 },
    { i: 'processes', x: 0, y: 4, w: 10, h: 10 },
    { i: 'network', x: 0, y: 14, w: 5, h: 4 },
    { i: 'disk', x: 5, y: 14, w: 5, h: 4 },
    { i: 'clock', x: 0, y: 18, w: 5, h: 4 },
    { i: 'weather', x: 5, y: 18, w: 5, h: 4 }
  ],
  sm: [
    { i: 'cpu', x: 0, y: 0, w: 3, h: 4 },
    { i: 'memory', x: 3, y: 0, w: 3, h: 4 },
    { i: 'processes', x: 0, y: 4, w: 6, h: 10 },
    { i: 'network', x: 0, y: 14, w: 3, h: 4 },
    { i: 'disk', x: 3, y: 14, w: 3, h: 4 },
    { i: 'clock', x: 0, y: 18, w: 3, h: 4 },
    { i: 'weather', x: 3, y: 18, w: 3, h: 4 }
  ],
  xs: [
    { i: 'cpu', x: 0, y: 0, w: 4, h: 4 },
    { i: 'memory', x: 0, y: 4, w: 4, h: 4 },
    { i: 'processes', x: 0, y: 8, w: 4, h: 10 },
    { i: 'network', x: 0, y: 18, w: 4, h: 4 },
    { i: 'disk', x: 0, y: 22, w: 4, h: 4 },
    { i: 'clock', x: 0, y: 26, w: 4, h: 4 },
    { i: 'weather', x: 0, y: 30, w: 4, h: 4 }
  ],
  xxs: [
    { i: 'cpu', x: 0, y: 0, w: 2, h: 4 },
    { i: 'memory', x: 0, y: 4, w: 2, h: 4 },
    { i: 'processes', x: 0, y: 8, w: 2, h: 10 },
    { i: 'network', x: 0, y: 18, w: 2, h: 4 },
    { i: 'disk', x: 0, y: 22, w: 2, h: 4 },
    { i: 'clock', x: 0, y: 26, w: 2, h: 4 },
    { i: 'weather', x: 0, y: 30, w: 2, h: 4 }
  ]
};

function App() {
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const width = useWindowWidth();

  // Load layouts from localStorage or use defaults
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('system-pulse-layout');
    return saved ? JSON.parse(saved) : defaultLayouts;
  });

  const onLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('system-pulse-layout', JSON.stringify(allLayouts));
  };

  useEffect(() => {
    // Determine backend URL (Cloud-Ready)
    // If we're on localhost:5173 (dev), we look for 3001. 
    // If we're in production (cloud), we assume the backend is on the same host at port 3001 or proxied.
    const backendHost = window.location.hostname === 'localhost' ? 'localhost:3001' : `${window.location.hostname}:3001`;
    const socket = io(`https://${backendHost}`);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('metrics', (data) => {
      setMetrics(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="dashboard-container" style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>System Pulse</h1>
          <div className="subtitle">Real-Time Metrics Monitoring (Drag & Resize Enabled)</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setShowReports(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
          >
            Reports
          </button>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#4ade80' : '#f87171',
              boxShadow: isConnected ? '0 0 10px #4ade80' : 'none'
            }} />
            <span style={{ fontSize: '0.8rem', color: isConnected ? '#4ade80' : '#f87171' }}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      <Responsive
        className="layout"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        onBreakpointChange={(bp, newCols) => {
          // Breakpoint change handling if needed
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        width={width}
        draggableHandle=".drag-handle"
        margin={[20, 20]}
      >
        <div key="cpu" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <div style={{ padding: '0 1rem 1rem', flex: 1 }}>
            <SystemMetrics metrics={metrics} type="cpu" />
          </div>
        </div>

        <div key="memory" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <div style={{ padding: '0 1rem 1rem', flex: 1 }}>
            <SystemMetrics metrics={metrics} type="memory" />
          </div>
        </div>

        <div key="processes" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <div style={{ padding: '0 1rem 1rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <ProcessList processes={metrics?.processes} />
          </div>
        </div>

        <div key="network" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <div style={{ padding: '0 1rem 1rem', flex: 1 }}>
            <NetworkWidget network={metrics?.network} />
          </div>
        </div>

        <div key="disk" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <div style={{ padding: '0 1rem 1rem', flex: 1 }}>
            <DiskWidget disk={metrics?.disk} />
          </div>
        </div>

        <div key="clock" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <ClockWidget />
        </div>

        <div key="weather" className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="drag-handle" style={{ height: '20px', cursor: 'grab', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '4px' }} title="Drag to move"></div>
          <WeatherWidget />
        </div>

      </Responsive>

      <ReportingModal
        isOpen={showReports}
        onClose={() => setShowReports(false)}
      />
    </div>
  );
}

export default App;
