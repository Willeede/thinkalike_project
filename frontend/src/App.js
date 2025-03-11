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
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Use local backend for testing
        const response = await fetch('http://localhost:3002/api/v1/graph/graph');

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>ThinkAlike</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
