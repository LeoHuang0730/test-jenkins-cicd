const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('./config');

class WebDriverSetup {
  constructor() {
    this.driver = null;
  }

  async createDriver() {
    const browser = config.browser.toLowerCase();
    
    let options;
    
    if (browser === 'chrome') {
      options = new chrome.Options();
      
      // Set Chrome binary path for Windows
      if (process.platform === 'win32') {
        options.setChromeBinaryPath('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
      }
      
      if (config.headless) {
        options.addArguments('--headless');
      }
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');
      options.addArguments('--disable-extensions');
      options.addArguments('--disable-plugins');
      options.addArguments('--disable-images');
      options.addArguments('--disable-web-security');
      options.addArguments('--allow-running-insecure-content');
    } else if (browser === 'firefox') {
      options = new firefox.Options();
      if (config.headless) {
        options.addArguments('--headless');
      }
    } else {
      throw new Error(`Unsupported browser: ${browser}`);
    }

    this.driver = await new Builder()
      .forBrowser(browser)
      .setChromeOptions(options)
      .setFirefoxOptions(options)
      .build();

    // Set timeouts
    await this.driver.manage().setTimeouts({
      implicit: config.implicitWait,
      pageLoad: config.pageLoadTimeout,
      script: config.scriptTimeout
    });

    // Set window size
    await this.driver.manage().window().setRect({
      width: config.windowWidth,
      height: config.windowHeight
    });

    return this.driver;
  }

  async quit() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  async takeScreenshot(filename) {
    if (this.driver && config.screenshotOnFailure) {
      const screenshot = await this.driver.takeScreenshot();
      const fs = require('fs');
      const path = require('path');
      
      // Ensure directory exists
      const dir = path.dirname(config.screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const filepath = path.join(config.screenshotPath, `${filename}.png`);
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`Screenshot saved: ${filepath}`);
    }
  }

  getDriver() {
    return this.driver;
  }
}

module.exports = WebDriverSetup;
