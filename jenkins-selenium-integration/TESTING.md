# Selenium WebDriver Testing with Jenkins CI/CD

This document explains how to run automated Selenium WebDriver tests for the Next.js application using Jenkins CI/CD pipeline.

## Overview

The testing setup includes:
- **Selenium WebDriver** for browser automation
- **Chrome/ChromeDriver** for headless browser testing
- **Jenkins Pipeline** for CI/CD integration
- **Cross-platform** support for Windows, Linux, and macOS
- **Comprehensive button testing** for the Next.js application

## Project Structure

```
jenkins-selenium-integration/
├── tests/
│   └── selenium/
│       ├── config.js              # Test configuration
│       ├── webdriver-setup.js     # WebDriver setup and management
│       ├── button-tests.js        # Main test suite for buttons
│       └── run-tests.js           # Test runner script
├── test-results/                  # Test results and screenshots
└── package.json                   # Updated with test scripts
```

## Test Configuration

The test configuration is managed in `tests/selenium/config.js`:

- **Base URL**: `http://localhost:3000` (configurable via `TEST_BASE_URL`)
- **Browser**: Chrome (configurable via `TEST_BROWSER`)
- **Headless Mode**: Enabled in CI, configurable via `HEADLESS`
- **Timeouts**: 10s implicit, 30s page load, 30s script
- **Window Size**: 1920x1080

## Test Coverage

The Selenium tests cover:

1. **Page Title Test**: Verifies the page title contains "Next.js"
2. **Deploy Button Test**: Tests the "Deploy now" button visibility, clickability, and href
3. **Read Docs Button Test**: Tests the "Read our docs" button functionality
4. **Footer Links Test**: Tests all footer links (Learn, Examples, Go to nextjs.org)
5. **Button Clickability Test**: Verifies buttons are clickable and in view

## Running Tests Locally

### Prerequisites

1. **Node.js 18+** installed
2. **Chrome browser** installed
3. **ChromeDriver** installed and in PATH

### Installation

```bash
cd jenkins-selenium-integration
npm install
```

### Running Tests

1. **Start the Next.js application**:
   ```bash
   npm run dev
   # or
   npm run build && npm start
   ```

2. **Run Selenium tests**:
   ```bash
   npm run test:selenium
   ```

3. **Run all tests (build + test)**:
   ```bash
   npm run test:ci
   ```

### Environment Variables

You can customize test behavior using environment variables:

```bash
# Set custom base URL
export TEST_BASE_URL=http://localhost:3001

# Use Firefox instead of Chrome
export TEST_BROWSER=firefox

# Run in non-headless mode (for debugging)
export HEADLESS=false

# Run in CI mode
export CI=true
```

## Alternative Testing Methods

### Using Different Browsers

You can test with different browsers by setting environment variables:

```bash
# Test with Firefox (if installed)
export TEST_BROWSER=firefox
npm run test:selenium

# Test in non-headless mode for debugging
export HEADLESS=false
npm run test:selenium
```

## Jenkins CI/CD Integration

The Jenkins pipeline (`Jenkinsfile`) includes the following stages:

1. **Checkout**: Get the latest code
2. **Setup Node.js**: Install Node.js if not available
3. **Install Dependencies**: Run `npm ci`
4. **Build Next.js App**: Run `npm run build`
5. **Start Application**: Start the app in background
6. **Run Selenium Tests**: Execute the test suite
7. **Generate Test Report**: Create CI/CD report
8. **Archive Reports**: Archive test results and screenshots

### Jenkins Environment Variables

The pipeline sets these environment variables:

- `NODE_VERSION=18`
- `TEST_BASE_URL=http://localhost:3000`
- `HEADLESS=true`
- `CI=true`

### Test Results

Jenkins archives:
- Test screenshots (on failure)
- Application logs
- CI/CD reports
- Test result files

## Test Results and Screenshots

Test results are stored in the `test-results/` directory:

```
test-results/
├── screenshots/
│   ├── deploy-button-test-failure.png
│   ├── read-docs-button-test-failure.png
│   └── button-clickability-test-failure.png
└── test-report.json (if implemented)
```

Screenshots are automatically captured when tests fail, helping with debugging.

## Troubleshooting

### Common Issues

1. **ChromeDriver version mismatch**:
   ```bash
   # Check Chrome version
   google-chrome --version
   
   # Download matching ChromeDriver
   CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d. -f1)
   CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION}")
   ```

2. **Application not starting**:
   - Check if port 3000 is available
   - Verify Next.js build completed successfully
   - Check application logs

3. **Tests timing out**:
   - Increase timeout values in `config.js`
   - Check if application is responding
   - Verify network connectivity

4. **Headless mode issues**:
   - Set `HEADLESS=false` for debugging
   - Check Chrome installation
   - Verify display/X11 setup (for Linux)

### Debug Mode

To run tests in debug mode:

```bash
# Non-headless mode
HEADLESS=false npm run test:selenium

# With verbose logging
DEBUG=* npm run test:selenium
```

## Extending Tests

### Adding New Tests

1. **Create new test method** in `button-tests.js`:
   ```javascript
   async testNewFeature() {
     console.log('Testing new feature...');
     // Your test logic here
     return true; // or false
   }
   ```

2. **Add to test suite** in `runAllTests()`:
   ```javascript
   results.newFeature = await this.testNewFeature();
   ```

3. **Update test data** in `config.js` if needed

### Customizing Selectors

Update selectors in `button-tests.js` to match your application:

```javascript
// Example: Find button by different selector
const button = await this.driver.findElement(
  By.css('.my-custom-button')  // CSS selector
  // or
  By.id('my-button-id')        // ID selector
  // or
  By.xpath("//button[contains(@class, 'my-class')]")  // XPath
);
```

## Best Practices

1. **Use explicit waits** instead of `sleep()`
2. **Take screenshots** on test failures
3. **Clean up resources** in teardown methods
4. **Use environment variables** for configuration
5. **Handle exceptions gracefully**
6. **Log meaningful messages** for debugging
7. **Keep tests independent** and idempotent

## Performance Considerations

- Tests run in headless mode by default for better performance
- Chrome is configured with performance optimizations
- Screenshots are only taken on failures
- Tests use efficient selectors (XPath, CSS)
- Implicit waits prevent unnecessary polling

## Security Notes

- Tests run in isolated browser environments
- No sensitive data in test configuration
- Jenkins runs tests in sandboxed environments
- Screenshots and logs are stored locally for debugging
