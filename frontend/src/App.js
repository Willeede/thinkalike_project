const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Add security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      // Avoid 'unsafe-eval' or inline scripts to keep CSP strict
    },
  },
}));

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: 'https://thinkalike-frontend.onrender.com', // Replace with your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  // Enforce JSON with charset to fix the MIME-type warning
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Example endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Helmet and headers are configured.' });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Trim any whitespace from the API URL
        const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3002').trim();
        console.log("Fetching from:", API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/api/v1/graph/graph`);
        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Data received:", data);

        setDataFlow(data);
        setConnectionStatus('connected');
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
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
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>ThinkAlike</h1>
          <button onClick={() => {}}>
            Toggle Connection Status (Current: {connectionStatus})
          </button>
        </header>
        <section className="content">
          <Routes>
            <Route path="/" element={
              <DataTraceability
                dataFlow={dataFlow}
                connectionStatus={connectionStatus}
              />
            } />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
