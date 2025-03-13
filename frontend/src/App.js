import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability.jsx';
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

                // Create a URL object instead of a string
                const baseUrl = new URL("https://thinkalike-api.onrender.com");
                const endpoint = "/api/v1/graph/graph";
                const apiUrl = new URL(endpoint, baseUrl).href;

                console.log("URL object created:", apiUrl);

                // Use the URL object's href property which cannot contain spaces
                const response = await fetch(apiUrl);

                console.log("Response status:", response.status);

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                console.log("Data received:", data);

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
                    <button onClick={() => {}}>
                        Toggle Connection Status (Current: {connectionStatus})
                    </button>
                </header>
                <section className="content">
                    <Routes>
                        <Route
                          path="/"
                          element={
                            <DataTraceability
                              dataFlow={dataFlow}
                              connectionStatus={connectionStatus}
                            />
                          }
                        />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;
