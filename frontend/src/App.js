import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ThinkAlike / CONNECTING LIKE MINDED INDIVIDUALS - Documentation Hub</h1> {/* Updated Homepage Title */}
      </header>
      <section className="content">
        <p>Welcome to the ThinkAlike Project! Explore our documentation below:</p>

        <ul>
          <li><a href="./manifesto_civilizationis_novae.md" target="_blank" rel="noopener noreferrer">Manifesto EOS LUMINA</a></li>
          <li><a href="./README.md" target="_blank" rel="noopener noreferrer">Short Manifesto (README.md)</a></li>
          <li><a href="./README_detailed.md" target="_blank" rel="noopener noreferrer">Detailed Project Overview</a></li>
          <li><a href="./docs/onboarding/ONBOARDING_GUIDE.md" target="_blank" rel="noopener noreferrer">Onboarding Guide</a></li>
          <li><a href="./docs/onboarding/QUICKSTART.md" target="_blank" rel="noopener noreferrer">Quick Start Guide</a></li>
        </ul>

        {/* You can add more homepage content or links below this line if needed */}

      </section>
    </div>
  );
}

export default App;
