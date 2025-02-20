import React, { useState } from 'react'; // Import useState
import DataTraceability from './components/DataTraceability';
import dataFlow from './data/DataTraceabilityExampleData';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // Add state

  const toggleConnectionStatus = () => {
    setConnectionStatus(prevStatus => {
      if (prevStatus === 'disconnected') {
        return 'connecting';
      } else if (prevStatus === 'connecting') {
        return 'connected';
      } else {
        return 'disconnected';
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Application Homepage</h1>
        {/* Add a button to toggle the connection status */}
        <button onClick={toggleConnectionStatus}>
          Toggle Connection Status (Current: {connectionStatus})
        </button>
      </header>
      <section className="content">
        {/* Pass connectionStatus as a prop */}
        <DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />
      </section>
    </div>
  );
}

export default App;
