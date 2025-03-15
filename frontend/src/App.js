import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability.jsx';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] }); // Initialize with empty structure
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.log("Data received in App.js:", data); // Keep this

                setDataFlow(data);
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
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>ThinkAlike</h1>
                </header>
                <section className="content">
                    <Routes>
                        <Route path="/" element={<DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;
