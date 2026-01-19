const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'metrics.db');
const db = new sqlite3.Database(dbPath);

// Initialize Database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            cpu_load REAL,
            mem_used_gb REAL,
            mem_total_gb REAL,
            net_rx_kb REAL,
            net_tx_kb REAL,
            disk_used_gb REAL,
            disk_total_gb REAL
        )
    `);

    // Create an index on timestamp for faster reporting
    db.run(`CREATE INDEX IF NOT EXISTS idx_timestamp ON metrics(timestamp)`);
});

const logMetrics = (data) => {
    const { cpu, memory, network, disk } = data;

    const stmt = db.prepare(`
        INSERT INTO metrics (cpu_load, mem_used_gb, mem_total_gb, net_rx_kb, net_tx_kb, disk_used_gb, disk_total_gb)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const memUsedGB = (memory.used / (1024 ** 3)).toFixed(2);
    const memTotalGB = (memory.total / (1024 ** 3)).toFixed(2);
    const netRxKB = (network.rx_sec / 1024).toFixed(2);
    const netTxKB = (network.tx_sec / 1024).toFixed(2);
    const diskUsedGB = (disk.used / (1024 ** 3)).toFixed(2);
    const diskTotalGB = (disk.size / (1024 ** 3)).toFixed(2);

    stmt.run(cpu.load, memUsedGB, memTotalGB, netRxKB, netTxKB, diskUsedGB, diskTotalGB);
    stmt.finalize();
};

const getMetricsReport = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM metrics WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp ASC`,
            [startDate, endDate],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

const purgeOldMetrics = (days) => {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM metrics WHERE timestamp < datetime('now', '-' || ? || ' days')`,
            [days],
            function (err) {
                if (err) {
                    console.error('Error during auto-purge:', err);
                    reject(err);
                } else {
                    console.log(`Auto-purge complete. Removed ${this.changes} old records.`);
                    resolve(this.changes);
                }
            }
        );
    });
};

module.exports = {
    logMetrics,
    getMetricsReport,
    purgeOldMetrics
};
