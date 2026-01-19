const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

async function generateCerts() {
    const certsDir = path.join(__dirname, '../certs');
    if (!fs.existsSync(certsDir)) {
        fs.mkdirSync(certsDir, { recursive: true });
    }

    const attrs = [{ name: 'commonName', value: 'systempulse.local' }];
    // Some versions of selfsigned might return a promise or have a sync method
    const pems = await selfsigned.generate(attrs, { days: 365 });

    if (!pems.cert || !pems.private) {
        console.error('Failed to generate certs:', pems);
        process.exit(1);
    }

    fs.writeFileSync(path.join(certsDir, 'server.crt'), pems.cert);
    fs.writeFileSync(path.join(certsDir, 'server.key'), pems.private);

    console.log('SSL Certificates generated successfully in /certs');
}

generateCerts();
