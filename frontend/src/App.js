import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [dataFlow, setDataFlow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log("DEBUGGING: Fetching from:", API_BASE_URL); // Changed for visibility

        const response = await fetch(`${API_BASE_URL}/api/v1/graph/graph`);
        console.log("DEBUGGING: Response status:", response.status); // Changed for visibility

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Data received in App.js:", data);

        // Add these:
        console.log("Before setDataFlow - dataFlow:", dataFlow);
        setDataFlow(data);
        console.log("After setDataFlow - dataFlow:", dataFlow);

        setConnectionStatus('connected');
      } catch (error) {
        console.error("DEBUGGING: Fetch error:", error); // Changed for visibility
        setError(error.message);
        setConnectionStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    console.log("DEBUGGING: useEffect running"); // Add this line
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ThinkAlike</h1>
        <h2>Data Traceability</h2>
      </header>
      <DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />
    </div>
  );
}

export default App;
