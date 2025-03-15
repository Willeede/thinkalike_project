import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability.jsx'; // Add the .jsx extension
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  // Use a single state variable with proper initialization
  const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log("Fetching from:", API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/api/v1/graph/graph`);
        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Data received:", data);

        setDataFlow(data); // Set the fetched data to dataFlow
        setConnectionStatus('connected');
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        setConnectionStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
