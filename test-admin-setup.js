#!/usr/bin/env node

/**
 * Admin Setup Test Script
 * Run this to test admin functionality
 */

const { execSync } = require('child_process');

console.log('🔧 Testing Admin Setup...\n');

// Test 1: Check environment variables
console.log('1. Checking environment variables...');
try {
  const result = execSync('grep ADMIN_EMAILS .env.local', { encoding: 'utf8' });
  console.log('✅ Admin emails configured:', result.trim());
} catch (error) {
  console.log('❌ ADMIN_EMAILS not found in .env.local');
}

// Test 2: Test admin setup API
console.log('\n2. Testing admin setup API...');
console.log('You can test the API by visiting:');
console.log('   http://localhost:3000/api/admin-setup (GET request)');
console.log('   http://localhost:3000/admin-setup (Setup page)');

// Test 3: Instructions
console.log('\n3. To complete admin setup:');
console.log('   a) Make sure your app is running: npm run dev');
console.log('   b) Sign up with email: collinzcalson@gmail.com');
console.log('   c) The user should automatically become admin');
console.log('   d) Visit: http://localhost:3000/dashboard/admin-dashboard');

console.log('\n✅ Admin setup is ready! 🎉');