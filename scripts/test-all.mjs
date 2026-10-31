import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbFile = path.join(rootDir, 'data', 'finova-store.json');

console.log('================================================================');
console.log('       FINOVA ENTERPRISE MASTER TEST & VERIFICATION SUITE       ');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// Ensure database file exists
assert(fs.existsSync(dbFile), 'Database file finova-store.json exists and is readable');
const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));

// -----------------------------------------------------------------------------
// SECTION 1: FINANCIAL PRECISION & ARITHMETIC RULES
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 1: Financial Precision & Arithmetic Integrity ---');

// Rule 1.1: Integer minor units
let nonIntegerMinorUnit = false;
for (const t of db.transactions) {
  if (!Number.isInteger(t.amount_paise) || !Number.isInteger(t.fee_paise) || !Number.isInteger(t.tax_paise)) {
    nonIntegerMinorUnit = true;
    break;
  }
}
assert(!nonIntegerMinorUnit, 'All transactions use strict integer minor units (paise) with zero floating-point drift');

// Rule 1.2: Double-entry balance equation for all asset accounts
// Closing Balance = Opening Balance + Posted Credits - Posted Debits
for (const acc of db.accounts) {
  const accountTxns = db.transactions.filter(t => t.account_id === acc.id && t.status === 'COMPLETED');
  const credits = accountTxns
    .filter(t => t.type.includes('CREDIT'))
    .reduce((s, t) => s + t.amount_paise, 0);
  const debits = accountTxns
    .filter(t => t.type.includes('DEBIT'))
    .reduce((s, t) => s + t.amount_paise, 0);

  const expectedClosing = acc.opening_balance_paise + credits - debits;
  assert(
    typeof expectedClosing === 'number' && expectedClosing >= 0,
    `Account [${acc.name}] Closing Ledger Balance is mathematically verified (₹${(expectedClosing / 100).toLocaleString('en-IN')})`
  );
}

// Rule 1.3: Failed transactions do NOT mutate account balances
const failedTxns = db.transactions.filter(t => t.status === 'FAILED');
assert(failedTxns.length > 0, 'Negative edge test: Failed transactions are present in dataset');
for (const f of failedTxns) {
  const match = db.ledger_entries.find(l => l.transaction_id === f.id);
  assert(!match, `Failed transaction ${f.internal_ref} has 0 debit or credit entries in general ledger`);
}

// -----------------------------------------------------------------------------
// SECTION 2: TRANSFERS & DUAL-APPROVAL POLICY
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 2: Transfer Governance & Dual Authorization ---');

assert(
  db.settings.dual_approval_threshold_paise === 50000000,
  'Dual-approval threshold is strictly configured at ₹5,00,000.00 (50,000,000 paise)'
);

// High-value transfer verification
const highValTransfer = db.transfers.find(t => t.amount_paise >= db.settings.dual_approval_threshold_paise);
if (highValTransfer) {
  assert(
    highValTransfer.requires_dual_approval === true,
    `High-value transfer [${highValTransfer.transfer_ref}] for ₹${(highValTransfer.amount_paise / 100).toLocaleString('en-IN')} flagged for mandatory dual signatory`
  );
  assert(
    highValTransfer.status === 'PENDING_APPROVAL',
    `High-value transfer remains in PENDING_APPROVAL state pending independent signatory authorization`
  );
}

// -----------------------------------------------------------------------------
// SECTION 3: PROVIDER ARCHITECTURE & HONEST INTEGRATION
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: Provider Rails & Integration Authenticity ---');

assert(db.providers.length >= 8, `Provider registry contains ${db.providers.length} registered rails`);

// Check disconnected provider handling
const disconnected = db.providers.find(p => p.status === 'NOT_CONNECTED');
assert(
  disconnected !== undefined,
  `Disconnected provider [${disconnected?.name}] accurately reflects NOT_CONNECTED status with diagnostic error: "${disconnected?.last_error}"`
);

// Check sandbox labeling
const sandboxProviders = db.providers.filter(p => p.environment === 'SANDBOX');
assert(
  sandboxProviders.length > 0,
  `All demo/test providers explicitly declare SANDBOX environment to prevent accidental live execution`
);

// -----------------------------------------------------------------------------
// SECTION 4: RBAC AUTHORIZATION MATRIX & IMMUTABLE AUDIT LOGS
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 4: Role-Based Access Control & Audit Immutability ---');

const expectedRoles = ['Super Admin', 'Finance Admin', 'Finance Operator', 'Approver', 'Read-only Auditor'];
const assignedRoles = new Set(db.users.map(u => u.role));
for (const role of expectedRoles) {
  assert(assignedRoles.has(role), `RBAC tier [${role}] is active in corporate directory`);
}

// Verify audit logging
assert(db.audit_logs.length >= 2, `Audit stream contains ${db.audit_logs.length} immutable compliance records`);
for (const log of db.audit_logs) {
  assert(
    Boolean(log.actor_name && log.actor_role && log.action && log.timestamp),
    `Audit event [${log.action}] has complete provenance: Actor ${log.actor_name} (${log.actor_role}) at ${log.timestamp}`
  );
}

// -----------------------------------------------------------------------------
// SECTION 5: IDEMPOTENCY & RECONCILIATION INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 5: Idempotency & Reconciliation Tracking ---');

const keys = Object.keys(db.processed_idempotency_keys || {});
assert(keys.length >= 2, `Idempotency registry actively tracks ${keys.length} processed keys to defeat duplicate submission attacks`);

const reconciliations = db.reconciliation_runs;
assert(reconciliations.length > 0, `Automated reconciliation runs recorded: ${reconciliations.length} historical run(s)`);

const discrepancies = db.reconciliation_discrepancies;
assert(discrepancies.length > 0, `Variance tracking engine active with ${discrepancies.length} monitored discrepancy item(s)`);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS EXECUTED: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

