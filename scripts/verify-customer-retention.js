#!/usr/bin/env node

/**
 * Customer Retention Feature Verification Script
 * 
 * This script runs tests specifically for the customer retention feature
 * to verify the contacts, calendar integration, and commitments functionality.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verification steps
console.log('🔍 Starting Customer Retention Feature Verification');
console.log('=================================================');

// Check that required files exist
console.log('\n✅ Checking required files existence...');
const requiredFiles = [
  'src/pages/Contacts.tsx',
  'src/pages/CalendarIntegration.tsx',
  'src/pages/customerRetention/CustomerRetentionCommitments.tsx',
  'src/tests/CustomerRetentionIntegration.test.tsx'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✓' : '✗'} ${file} ${exists ? 'exists' : 'is missing'}`);
  if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please check the file structure.');
  process.exit(1);
}

// Run tests
console.log('\n✅ Running the integration tests...');

try {
  console.log('\n🧪 Running Customer Retention Integration Tests...');
  execSync('npm test -- --testPathPattern="CustomerRetention|Contacts|Calendar" --passWithNoTests', { stdio: 'inherit' });
  console.log('✅ Integration tests completed successfully');
} catch (error) {
  console.error('❌ Integration tests failed');
  process.exit(1);
}

// Manual verification checklist
console.log('\n🔍 Manual Verification Checklist');
console.log('=================================================');
console.log(`
Please verify the following functionality manually:

1. Contacts Page:
   - [ ] All contacts are displayed correctly
   - [ ] Contact details can be viewed by clicking View
   - [ ] Contact filtering works by status
   - [ ] Adding a new contact works
   - [ ] Calendar button navigates to Calendar Integration

2. Calendar Integration:
   - [ ] Connected calendars display correctly
   - [ ] Calendar settings can be changed
   - [ ] Calendar sync button shows visual feedback
   - [ ] Google/Microsoft/Apple options are available

3. Commitments:
   - [ ] All commitments display in the table
   - [ ] Dashboard metrics show correct numbers
   - [ ] Adding a new commitment works
   - [ ] Search and filters work correctly
   - [ ] Auto-renew indicators are visible for appropriate commitments

Report any issues found during manual testing.
`);

// Exit with success code
process.exit(0); 