// generate-secrets.js
const crypto = require('crypto');

console.log('=== JWT Secrets ===');
console.log();
console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('NEXTAUTH_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log();
console.log('Add these to your .env.local file');