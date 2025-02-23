import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';

function App() {
  const [dataFlow, setDataFlow] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Fetch initial data flow from backend
    fetch('https://thinkalike-backend.onrender.com/api/v1/graph')
      .then(response => response.json())
      .then(data => setDataFlow(data))
      .catch(error => console.error('Error fetching graph data:', error));

    // Simulate connection status changes
    const statuses = ['disconnected', 'connecting', 'connected'];
    let index = 0;
    const intervalId = setInterval(() => {
      setConnectionStatus(statuses[index]);
      index = (index + 1) % statuses.length;
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ThinkAlike Project</h1>
      </header>
      {dataFlow ? (
        <DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default App;
