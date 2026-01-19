const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'System Pulse Dashboard',
    description: 'Real-time system metrics monitoring service.',
    script: path.join(__dirname, '../server/index.js'),
    env: [{
        name: "NODE_ENV",
        value: "production"
    }]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    console.log('Install complete.');
    svc.start();
});

// Just in case this already exists, let's uninstall it first
// svc.uninstall(); 

svc.install();
