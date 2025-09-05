const { By, until } = require('selenium-webdriver');
const WebDriverSetup = require('./webdriver-setup');
const config = require('./config');

class ButtonTests {
  constructor() {
    this.webDriverSetup = new WebDriverSetup();
    this.driver = null;
  }

  async setup() {
    console.log('Setting up WebDriver...');
    this.driver = await this.webDriverSetup.createDriver();
    console.log('WebDriver setup completed');
  }

  async teardown() {
    await this.webDriverSetup.quit();
    console.log('WebDriver teardown completed');
  }

  async navigateToHomePage() {
    console.log(`Navigating to ${config.baseUrl}`);
    await this.driver.get(config.baseUrl);
    
    // Wait for page to load - be more flexible with title
    try {
      await this.driver.wait(until.titleContains('Next.js'), config.pageLoadTimeout);
    } catch (error) {
      // If Next.js not in title, just wait for any title
      await this.driver.wait(until.titleContains(''), config.pageLoadTimeout);
    }
    console.log('Successfully navigated to home page');
  }

  async testPageTitle() {
    console.log('Testing page title...');
    try {
      const title = await this.driver.getTitle();
      console.log(`Page title: ${title}`);
      
      if (title && title.length > 0) {
        console.log('✅ Page title test passed');
        return true;
      } else {
        console.log('❌ Page title test failed - no title found');
        return false;
      }
    } catch (error) {
      console.log(`❌ Page title test failed: ${error.message}`);
      return false;
    }
  }

  async testPageStructure() {
    console.log('Testing page structure and elements...');
    try {
      // Test main page elements are present
      const homePage = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="home-page"]')),
        config.implicitWait
      );
      
      const mainContent = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="main-content"]')),
        config.implicitWait
      );
      
      const interactiveSection = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="interactive-section"]')),
        config.implicitWait
      );

      const isHomePageDisplayed = await homePage.isDisplayed();
      const isMainContentDisplayed = await mainContent.isDisplayed();
      const isInteractiveSectionDisplayed = await interactiveSection.isDisplayed();

      console.log(`Page structure - Home: ${isHomePageDisplayed}, Main: ${isMainContentDisplayed}, Interactive: ${isInteractiveSectionDisplayed}`);

      if (isHomePageDisplayed && isMainContentDisplayed && isInteractiveSectionDisplayed) {
        console.log('✅ Page structure test passed');
        return true;
      } else {
        console.log('❌ Page structure test failed');
        return false;
      }
    } catch (error) {
      console.log(`❌ Page structure test failed: ${error.message}`);
      await this.webDriverSetup.takeScreenshot('page-structure-test-failure');
      return false;
    }
  }

  async testInteractiveTitle() {
    console.log('Testing interactive section title...');
    try {
      const title = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="interactive-title"]')),
        config.implicitWait
      );

      const isDisplayed = await title.isDisplayed();
      const titleText = await title.getText();
      
      console.log(`Interactive title - Displayed: ${isDisplayed}, Text: "${titleText}"`);
      
      if (isDisplayed && titleText.includes('Interactive Elements')) {
        console.log('✅ Interactive title test passed');
        return true;
      } else {
        console.log('❌ Interactive title test failed');
        return false;
      }
    } catch (error) {
      console.log(`❌ Interactive title test failed: ${error.message}`);
      await this.webDriverSetup.takeScreenshot('interactive-title-test-failure');
      return false;
    }
  }

  async testInteractiveElements() {
    console.log('Testing interactive elements...');
    try {
      // Test the clickable button
      const clickButton = await this.driver.wait(
        until.elementLocated(By.id('test-button')),
        config.implicitWait
      );

      // Test the reset button
      const resetButton = await this.driver.wait(
        until.elementLocated(By.id('reset-button')),
        config.implicitWait
      );

      // Test the input field
      const inputField = await this.driver.wait(
        until.elementLocated(By.id('test-input')),
        config.implicitWait
      );

      // Test the select dropdown
      const selectDropdown = await this.driver.wait(
        until.elementLocated(By.id('test-select')),
        config.implicitWait
      );

      // Test counter display
      const counterDisplay = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="click-count"]')),
        config.implicitWait
      );

      // Check if all elements are displayed
      const clickButtonDisplayed = await clickButton.isDisplayed();
      const resetButtonDisplayed = await resetButton.isDisplayed();
      const inputFieldDisplayed = await inputField.isDisplayed();
      const selectDropdownDisplayed = await selectDropdown.isDisplayed();
      const counterDisplayed = await counterDisplay.isDisplayed();

      console.log(`Interactive elements - Click Button: ${clickButtonDisplayed}, Reset Button: ${resetButtonDisplayed}, Input: ${inputFieldDisplayed}, Select: ${selectDropdownDisplayed}, Counter: ${counterDisplayed}`);

      if (clickButtonDisplayed && resetButtonDisplayed && inputFieldDisplayed && selectDropdownDisplayed && counterDisplayed) {
        console.log('✅ Interactive elements test passed');
        return true;
      } else {
        console.log('❌ Interactive elements test failed');
        return false;
      }
    } catch (error) {
      console.log(`❌ Interactive elements test failed: ${error.message}`);
      await this.webDriverSetup.takeScreenshot('interactive-elements-test-failure');
      return false;
    }
  }

  async testButtonInteractions() {
    console.log('Testing button interactions...');
    try {
      // Get initial counter value
      const counterElement = await this.driver.findElement(By.css('[data-testid="click-count"]'));
      const initialCount = await counterElement.getText();
      console.log(`Initial count: ${initialCount}`);

      // Click the test button
      const clickButton = await this.driver.findElement(By.id('test-button'));
      await clickButton.click();
      await this.driver.sleep(500); // Wait for state update

      // Check if counter increased
      const newCount = await counterElement.getText();
      console.log(`Count after click: ${newCount}`);

      if (parseInt(newCount) > parseInt(initialCount)) {
        console.log('✅ Button interaction test passed');
        return true;
      } else {
        console.log('❌ Button interaction test failed - counter did not increase');
        return false;
      }
    } catch (error) {
      console.log(`❌ Button interaction test failed: ${error.message}`);
      await this.webDriverSetup.takeScreenshot('button-interaction-test-failure');
      return false;
    }
  }

  async testFormElements() {
    console.log('Testing form elements...');
    try {
      // Test input field
      const inputField = await this.driver.findElement(By.id('test-input'));
      const testText = 'Selenium test input';
      await inputField.clear();
      await inputField.sendKeys(testText);
      
      const inputValue = await inputField.getAttribute('value');
      console.log(`Input value: ${inputValue}`);

      // Test select dropdown
      const selectDropdown = await this.driver.findElement(By.id('test-select'));
      const select = new (require('selenium-webdriver').Select)(selectDropdown);
      await select.selectByValue('option2');
      
      const selectedOption = await select.getFirstSelectedOption();
      const selectedValue = await selectedOption.getAttribute('value');
      console.log(`Selected value: ${selectedValue}`);

      if (inputValue === testText && selectedValue === 'option2') {
        console.log('✅ Form elements test passed');
        return true;
      } else {
        console.log('❌ Form elements test failed');
        return false;
      }
    } catch (error) {
      console.log(`❌ Form elements test failed: ${error.message}`);
      await this.webDriverSetup.takeScreenshot('form-elements-test-failure');
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Selenium button tests...');
    const results = {
      pageTitle: false,
      pageStructure: false,
      interactiveTitle: false,
      interactiveElements: false,
      buttonInteractions: false,
      formElements: false
    };

    try {
      await this.setup();
      await this.navigateToHomePage();

      // Run all tests
      results.pageTitle = await this.testPageTitle();
      results.pageStructure = await this.testPageStructure();
      results.interactiveTitle = await this.testInteractiveTitle();
      results.interactiveElements = await this.testInteractiveElements();
      results.buttonInteractions = await this.testButtonInteractions();
      results.formElements = await this.testFormElements();

      // Calculate overall result
      const passedTests = Object.values(results).filter(Boolean).length;
      const totalTests = Object.keys(results).length;
      const overallSuccess = passedTests === totalTests;

      console.log('\n📊 Test Results Summary:');
      console.log('========================');
      Object.entries(results).forEach(([test, result]) => {
        console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASSED' : 'FAILED'}`);
      });
      console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
      console.log(`Result: ${overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

      return overallSuccess;

    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      await this.webDriverSetup.takeScreenshot('test-execution-failure');
      return false;
    } finally {
      await this.teardown();
    }
  }
}

module.exports = ButtonTests;
