import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability'; // CORRECTED IMPORT
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Graph from './components/Graph';

function App() {
    console.log("App component rendered (or re-rendered)"); // Log 1

    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("useEffect hook triggered"); // Log 2
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log("API_BASE_URL:", API_BASE_URL); // Log 3

        fetch(`${API_BASE_URL}/api/v1/graph/graph`)
            .then((response) => {
                console.log("Fetch response received:", response); // Log 4
                if (!response.ok) {
                    console.error("HTTP error! Status:", response.status); // Log 5
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Data received:", data); // Log 6
                setDataFlow(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching graph data:", error); // Log 7
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const toggleConnectionStatus = () => {
        console.log("toggleConnectionStatus called"); // Log 8
        setConnectionStatus(prevStatus => {
            console.log("Previous connection status:", prevStatus); // Log 9
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
        console.log("Loading state - rendering loading indicator"); // Log 10
        return <div>Loading...</div>;
    }

    if (error) {
        console.log("Error state - rendering error message"); // Log 11
        return <div>Error: {error}</div>;
    }

    console.log("Rendering main App component content"); // Log 12

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