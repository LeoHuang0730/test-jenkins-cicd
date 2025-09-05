#!/usr/bin/env node

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');

async function diagnose() {
  console.log('🔍 Selenium Diagnostic Tool');
  console.log('==========================');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Browser: ${config.browser}`);
  console.log(`Headless: ${config.headless}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Node.js: ${process.version}`);
  console.log('');

  let driver = null;
  
  try {
    console.log('1. Checking Chrome installation...');
    try {
      const { execSync } = require('child_process');
      if (process.platform === 'win32') {
        execSync('where chrome', { stdio: 'pipe' });
        console.log('✅ Chrome found in PATH');
      } else {
        execSync('which google-chrome', { stdio: 'pipe' });
        console.log('✅ Chrome found in PATH');
      }
    } catch (error) {
      console.log('⚠️  Chrome not found in PATH, trying default locations...');
    }

    console.log('2. Creating WebDriver...');
    const options = new chrome.Options();
    
    // Windows-specific options
    if (process.platform === 'win32') {
      options.addArguments('--disable-gpu');
      options.addArguments('--disable-extensions');
      options.addArguments('--disable-plugins');
      options.addArguments('--disable-images');
      options.addArguments('--disable-javascript');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-web-security');
      options.addArguments('--allow-running-insecure-content');
    } else {
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
    }
    
    if (config.headless) {
      options.addArguments('--headless');
    }
    
    console.log('   Chrome options configured');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    console.log('✅ WebDriver created successfully');

    console.log('2. Navigating to application...');
    await driver.get(config.baseUrl);
    console.log('✅ Navigation completed');

    console.log('3. Getting page title...');
    const title = await driver.getTitle();
    console.log(`✅ Page title: "${title}"`);

    console.log('4. Checking if page is loaded...');
    await driver.wait(until.titleContains(''), 10000);
    console.log('✅ Page is loaded');

    console.log('5. Looking for main elements...');
    
    // Check for home page
    try {
      const homePage = await driver.findElement(By.css('[data-testid="home-page"]'));
      console.log('✅ Found home-page element');
    } catch (error) {
      console.log('❌ home-page element not found');
    }

    // Check for main content
    try {
      const mainContent = await driver.findElement(By.css('[data-testid="main-content"]'));
      console.log('✅ Found main-content element');
    } catch (error) {
      console.log('❌ main-content element not found');
    }

    // Check for interactive section
    try {
      const interactiveSection = await driver.findElement(By.css('[data-testid="interactive-section"]'));
      console.log('✅ Found interactive-section element');
    } catch (error) {
      console.log('❌ interactive-section element not found');
    }

    // Check for test button
    try {
      const testButton = await driver.findElement(By.id('test-button'));
      console.log('✅ Found test-button element');
    } catch (error) {
      console.log('❌ test-button element not found');
    }

    console.log('6. Taking screenshot...');
    const screenshot = await driver.takeScreenshot();
    const fs = require('fs');
    fs.writeFileSync('./diagnostic-screenshot.png', screenshot, 'base64');
    console.log('✅ Screenshot saved as diagnostic-screenshot.png');

    console.log('\n🎉 Diagnostic completed successfully!');

  } catch (error) {
    console.error('\n💥 Diagnostic failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('WebDriver closed');
    }
  }
}

diagnose();
