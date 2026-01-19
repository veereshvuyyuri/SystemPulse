const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
    name: 'System Pulse Dashboard',
    script: path.join(__dirname, '../server/index.js')
});

// Listen for the "uninstall" event, which indicates the
// process is no longer a service.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.install(); // This is sometimes needed if svc doesn't "know" it exists yet

svc.uninstall();
