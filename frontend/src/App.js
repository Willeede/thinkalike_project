import React, { useState, useEffect } from 'react';
import './App.css';
import DataTraceability from './components/DataTraceability';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import

    function App() {
      const [dataFlow, setDataFlow] = useState(null);
      const [connectionStatus, setConnectionStatus] = useState('Waiting for connection...');
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            setConnectionStatus('Connecting to the server...');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            console.log("Fetching from:", apiUrl);
            const response = await fetch(`${apiUrl}/api/v1/graph/graph`);

            console.log("Response status:", response.status);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data received in App.js:", data);
            setDataFlow(data);
            setConnectionStatus('Successfully connected and data received!');
            setError(null); // Clear any previous errors
          } catch (error) {
            console.error("Error fetching data:", error);
            setConnectionStatus('Failed to connect to the server.');
            setError(error.message);
          }
        };

        fetchData();
      }, []);

      return (

          <div className="App">
            <header className="App-header">
              <h1>ThinkAlike</h1>
              <p>Connection Status: {connectionStatus}</p>
              {error && <p>Error: {error}</p>}
            </header>
            <main>
              <Routes> {/* Use Routes here */}
                <Route path="/" element={<DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />} />
              </Routes>
            </main>
          </div>

      );
    }

    export default App;
