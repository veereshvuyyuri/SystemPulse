const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const { getSystemMetrics } = require('./metricsService');
const { logMetrics, getMetricsReport, purgeOldMetrics } = require('./databaseService');

const app = express();

// Load SSL Certificates
const certPath = path.join(__dirname, '../certs/server.crt');
const keyPath = path.join(__dirname, '../certs/server.key');
const credentials = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const server = https.createServer(credentials, app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev simplicity
        methods: ["GET", "POST"]
    }
});

const PORT = 3001;
const UPDATE_INTERVAL = 5000; // 5 seconds
const MAINTENANCE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Run initial purge on startup (Cleanup any data older than 30 days)
purgeOldMetrics(30).catch(err => console.error('Startup purge failed:', err));

// Set up periodic maintenance
setInterval(() => {
    purgeOldMetrics(30).catch(err => console.error('Maintenance purge failed:', err));
}, MAINTENANCE_INTERVAL);

// Enable JSON parsing for API
app.use(express.json());

// Reporting API
app.get('/api/reports', async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end dates are required' });
        }
        const reports = await getMetricsReport(start, end);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

let currentMetrics = null;

// Global polling loop
setInterval(async () => {
    const metrics = await getSystemMetrics();
    if (metrics) {
        currentMetrics = metrics;
        io.emit('metrics', currentMetrics);

        // Log to database for historical reporting
        logMetrics(currentMetrics);
    }
}, UPDATE_INTERVAL);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send the most recent metrics immediately on connection
    if (currentMetrics) {
        socket.emit('metrics', currentMetrics);
    } else {
        // If no metrics yet, trigger an immediate (non-waiting) fetch
        getSystemMetrics().then(metrics => {
            if (metrics) {
                currentMetrics = metrics;
                socket.emit('metrics', currentMetrics);
            }
        });
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

server.listen(PORT, () => {
    console.log(`Metrics Server running on http://localhost:${PORT}`);
});
