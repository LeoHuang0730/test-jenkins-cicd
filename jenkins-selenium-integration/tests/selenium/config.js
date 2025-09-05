module.exports = {
  // Test configuration
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  
  // Browser configuration
  browser: process.env.TEST_BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true' || process.env.CI === 'true',
  
  // Timeouts
  implicitWait: 10000,
  pageLoadTimeout: 30000,
  scriptTimeout: 30000,
  
  // Window size
  windowWidth: 1920,
  windowHeight: 1080,
  
  // Screenshot settings
  screenshotOnFailure: true,
  screenshotPath: './test-results/screenshots/',
  
  // Test data
  testData: {
    expectedTitle: 'Next.js App',
    buttonTexts: ['Deploy now', 'Read our docs', 'Learn', 'Examples', 'Go to nextjs.org →']
  }
};
