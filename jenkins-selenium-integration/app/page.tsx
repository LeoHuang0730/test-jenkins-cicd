'use client';

import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [buttonText, setButtonText] = useState("Click me!");

  const handleButtonClick = () => {
    setClickCount(prev => prev + 1);
    setButtonText(`Clicked ${clickCount + 1} times!`);
  };

  const handleReset = () => {
    setClickCount(0);
    setButtonText("Click me!");
  };

  return (
    <div className={styles.page} data-testid="home-page">
      <main className={styles.main} data-testid="main-content">

        {/* Interactive Testing Section */}
        <div data-testid="interactive-section" style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2 data-testid="interactive-title">Interactive Elements for Testing</h2>
          
          <div data-testid="button-section" style={{ margin: '1rem 0' }}>
            <button
              id="test-button"
              onClick={handleButtonClick}
              data-testid="clickable-button"
              data-cy="clickable-button"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {buttonText}
            </button>
            
            <button
              id="reset-button"
              onClick={handleReset}
              data-testid="reset-button"
              data-cy="reset-button"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
          
          <div data-testid="counter-display" style={{ margin: '1rem 0', fontSize: '18px', fontWeight: 'bold' }}>
            Click Count: <span data-testid="click-count">{clickCount}</span>
          </div>
          
          <input
            id="test-input"
            type="text"
            placeholder="Type something here..."
            data-testid="test-input"
            data-cy="test-input"
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '300px',
              marginRight: '10px'
            }}
          />
          
          <select
            id="test-select"
            data-testid="test-select"
            data-cy="test-select"
            style={{
              padding: '8px 12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          >
            <option value="">Select an option</option>
            <option value="option1" data-testid="option-1">Option 1</option>
            <option value="option2" data-testid="option-2">Option 2</option>
            <option value="option3" data-testid="option-3">Option 3</option>
          </select>
        </div>
      </main>
    </div>
  );
}
