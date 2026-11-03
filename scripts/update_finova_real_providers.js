const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'finova-store.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Obsolete dead rails to purge
const obsoleteCodes = [
  'chillr', 'trupay', 'oxigen', 'moneyonmobile', 'zipcash',
  'mpurse', 'aadhaar', 'itzcash', 'mrupee', 'quikwallet', 'citrus'
];

// Real authentic banks & rails to replace them with
const realReplacements = [
  {
    id: 'prov_kotak',
    name: 'Kotak Mahindra Bank Corporate Direct',
    code: 'kotak',
    category: 'BANK',
    status: 'NOT_CONNECTED',
    environment: 'SANDBOX',
    webhook_url: 'https://api.finova.internal/webhooks/kotak',
    supported_operations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
    merchant_id_masked: 'KOTAK••••8192',
    health_score: 0,
    last_error: 'Awaiting Mutual TLS Corporate Key Exchange & Board Authorization'
  },
  {
    id: 'prov_pnb',
    name: 'Punjab National Bank Corporate CMS',
    code: 'pnb',
    category: 'BANK',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    webhook_url: 'https://api.finova.internal/webhooks/pnb',
    supported_operations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
    merchant_id_masked: 'PNB••••4401',
    health_score: 99.4,
    last_error: null
  },
  {
    id: 'prov_indusind',
    name: 'IndusInd Bank Corporate Direct API',
    code: 'indusind',
    category: 'BANK',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    webhook_url: 'https://api.finova.internal/webhooks/indusind',
    supported_operations: ['PAYMENTS', 'PAYOUTS'],
    merchant_id_masked: 'INDUS••••9281',
    health_score: 99.6,
    last_error: null
  },
  {
    id: 'prov_yesbank',
    name: 'YES Bank API Banking Switch',
    code: 'yesbank',
    category: 'BANK',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    webhook_url: 'https://api.finova.internal/webhooks/yesbank',
    supported_operations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
    merchant_id_masked: 'YES••••5839',
    health_score: 99.7,
    last_error: null
  },
  {
    id: 'prov_idfc',
    name: 'IDFC FIRST Bank Direct Corporate Rail',
    code: 'idfc',
    category: 'BANK',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    webhook_url: 'https://api.finova.internal/webhooks/idfc',
    supported_operations: ['PAYMENTS', 'PAYOUTS', 'SETTLEMENTS'],
    merchant_id_masked: 'IDFC••••7104',
    health_score: 99.8,
    last_error: null
  },
  {
    id: 'prov_federal',
    name: 'Federal Bank FedNet Corporate CMS',
    code: 'federal',
    category: 'BANK',
    status: 'CONNECTED',
    environment: 'PRODUCTION',
    webhook_url: 'https://api.finova.internal/webhooks/federal',
    supported_operations: ['PAYMENTS', 'PAYOUTS'],
    merchant_id_masked: 'FED••••2290',
    health_score: 99.5,
    last_error: null
  }
];

// Filter out obsolete
db.providers = db.providers.filter(p => !obsoleteCodes.includes(p.code));

// Ensure ICICI is SANDBOX and has last_error if not connected
const icici = db.providers.find(p => p.code === 'icici_bank');
if (icici) {
  icici.status = 'NOT_CONNECTED';
  icici.environment = 'SANDBOX';
  icici.last_error = 'Requires Mutual TLS Client Certificate & Corporate Signatory approval.';
}

// Add real replacements if not present
for (const rep of realReplacements) {
  if (!db.providers.some(p => p.code === rep.code)) {
    db.providers.push(rep);
  }
}

// Ensure HDFC corporate has logo/brand
const hdfc = db.providers.find(p => p.code === 'hdfc_bank');
if (hdfc) {
  hdfc.name = 'HDFC Corporate Direct Host-to-Host';
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Database updated successfully. Remaining providers count:', db.providers.length);
console.log('Codes:', db.providers.map(p => p.code).join(', '));

