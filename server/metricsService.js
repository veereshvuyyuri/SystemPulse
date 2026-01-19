const si = require('systeminformation');
const os = require('os');

let cachedStatic = null;
let isGathering = false;

const getSystemMetrics = async () => {
    if (isGathering) {
        return null;
    }

    isGathering = true;
    const startTime = Date.now();

    try {
        // 1. Static Info (Instant using 'os' module)
        if (!cachedStatic) {
            const cpus = os.cpus();
            cachedStatic = {
                cpu: {
                    manufacturer: cpus[0]?.model.split(' ')[0] || 'Unknown',
                    brand: cpus[0]?.model || 'Unknown',
                    cores: cpus.length,
                    speed: (cpus[0]?.speed / 1000).toFixed(2)
                },
                os: {
                    platform: os.platform(),
                    distro: os.type(),
                    release: os.release(),
                    hostname: os.hostname()
                },
                memory: {
                    total: os.totalmem()
                }
            };
        }

        // 2. Dynamic Metrics (Mix of 'os' for speed and 'si' for depth)
        const freeMem = os.freemem();
        const usedMem = cachedStatic.memory.total - freeMem;

        // Fetch the slow ones in parallel
        // We still use si for these as os doesn't provide them easily
        const [currentLoad, processes, networkStats, fsSize] = await Promise.all([
            si.currentLoad(),
            si.processes(),
            si.networkStats(),
            si.fsSize()
        ]);

        // Format Processes (Top 50)
        const topProcesses = (processes?.list || [])
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 50)
            .map(p => ({
                name: p.name,
                cpu: (p.cpu || 0).toFixed(1),
                mem: (p.mem || 0).toFixed(1),
                started: p.started,
                pid: p.pid
            }));

        // Network Speed
        const netStatsArray = Array.isArray(networkStats) ? networkStats : [];
        const netRx = netStatsArray.reduce((acc, iface) => acc + (iface.rx_sec || 0), 0);
        const netTx = netStatsArray.reduce((acc, iface) => acc + (iface.tx_sec || 0), 0);

        // Main Disk
        const fsSizeArray = Array.isArray(fsSize) ? fsSize : [];
        const mainDisk = fsSizeArray.filter(d => d.size > 0).sort((a, b) => b.size - a.size)[0] || {};

        const result = {
            cpu: {
                ...cachedStatic.cpu,
                load: currentLoad.currentLoad.toFixed(1),
                temperature: 0
            },
            memory: {
                ...cachedStatic.memory,
                free: freeMem,
                used: usedMem,
                active: usedMem, // approximation
                available: freeMem
            },
            os: cachedStatic.os,
            network: {
                rx_sec: netRx,
                tx_sec: netTx
            },
            disk: {
                fs: mainDisk.fs,
                type: mainDisk.type,
                size: mainDisk.size,
                used: mainDisk.used,
                use: mainDisk.use
            },
            processes: topProcesses,
            timestamp: new Date().toISOString(),
            elapsed: Date.now() - startTime
        };

        return result;
    } catch (error) {
        console.error('Error gathering metrics:', error);
        return null; // Don't block future calls
    } finally {
        isGathering = false;
    }
};

module.exports = {
    getSystemMetrics
};
