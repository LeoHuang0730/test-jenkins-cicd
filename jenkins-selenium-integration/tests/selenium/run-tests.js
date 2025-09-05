#!/usr/bin/env node

const ButtonTests = require('./button-tests');
const config = require('./config');

async function main() {
  console.log('🔧 Selenium Test Runner');
  console.log('======================');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Browser: ${config.browser}`);
  console.log(`Headless: ${config.headless}`);
  console.log('');

  const buttonTests = new ButtonTests();
  
  try {
    console.log('Starting test execution...');
    const success = await buttonTests.runAllTests();
    
    if (success) {
      console.log('\n🎉 All tests completed successfully!');
      process.exit(0);
    } else {
      console.log('\n💥 Some tests failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test runner failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
main();
