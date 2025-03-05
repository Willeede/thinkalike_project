import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability'; // Corrected import
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Graph from './components/Graph';

function App() {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Use environment variable

        fetch(`${API_BASE_URL}/api/v1/graph/graph`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setDataFlow(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching graph data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>ThinkAlike</h1>
                    <button onClick={toggleConnectionStatus}>
                        Toggle Connection Status (Current: {connectionStatus})
                    </button>
                </header>
                <section className="content">
                    <Routes>
                        <Route path="/" element={<DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />} />
                        <Route path="/graph" element={<Graph />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;