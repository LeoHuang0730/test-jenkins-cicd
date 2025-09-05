#!/usr/bin/env node

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');

async function simpleTest() {
  console.log('🧪 Simple Selenium Test');
  console.log('======================');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Platform: ${process.platform}`);
  console.log('');

  let driver = null;
  
  try {
    console.log('Creating WebDriver with minimal options...');
    
    const options = new chrome.Options();
    
    // Set Chrome binary path for Windows
    if (process.platform === 'win32') {
      options.setChromeBinaryPath('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
    }
    
    // Minimal options for Windows
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    
    // Try to create driver with timeout
    const createPromise = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // Add timeout to driver creation
    driver = await Promise.race([
      createPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('WebDriver creation timeout after 30 seconds')), 30000)
      )
    ]);
    
    console.log('✅ WebDriver created successfully');
    
    console.log('Navigating to application...');
    await driver.get(config.baseUrl);
    console.log('✅ Navigation completed');
    
    console.log('Getting page title...');
    const title = await driver.getTitle();
    console.log(`✅ Page title: "${title}"`);
    
    console.log('Checking for basic elements...');
    const body = await driver.findElement(By.tagName('body'));
    console.log('✅ Body element found');
    
    console.log('\n🎉 Simple test completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Simple test failed:', error.message);
    
    if (error.message.includes('ChromeDriver')) {
      console.error('\n🔧 ChromeDriver Issue Detected:');
      console.error('   - ChromeDriver may not be installed');
      console.error('   - ChromeDriver version may not match Chrome version');
      console.error('   - Try running: npm install chromedriver --save-dev');
    }
    
    if (error.message.includes('chrome') || error.message.includes('Chrome')) {
      console.error('\n🔧 Chrome Issue Detected:');
      console.error('   - Chrome browser may not be installed');
      console.error('   - Chrome may not be in PATH');
      console.error('   - Try installing Google Chrome');
    }
    
    if (error.message.includes('timeout')) {
      console.error('\n🔧 Timeout Issue Detected:');
      console.error('   - WebDriver creation is taking too long');
      console.error('   - This might be a Chrome/ChromeDriver compatibility issue');
    }
    
    console.error('\nFull error:', error);
  } finally {
    if (driver) {
      try {
        await driver.quit();
        console.log('WebDriver closed');
      } catch (error) {
        console.log('Error closing WebDriver:', error.message);
      }
    }
  }
}

simpleTest();
