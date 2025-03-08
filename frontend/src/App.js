import React, { useState, useEffect } from 'react';
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataTraceability from './components/DataTraceability';
import Graph from './components/Graph';
import SearchBar from './components/SearchBar';
import './components/SearchBar.css';

function App() {
    console.log("App component rendered (or re-rendered)");

    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        console.log("API_BASE_URL:", API_BASE_URL);

        // Use the main endpoint that fetches from database
        fetch(`${API_BASE_URL}/api/v1/graph`)
          .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Received API data:", data);
            if (data.nodes && data.edges) {
                setDataFlow(data);
            } else {
                console.error("Invalid data format received:", data);
                throw new Error("Invalid data format");
            }
            setLoading(false);
          })
          .catch(err => {
            console.error("Error fetching graph data:", err);
            setError(err.message);
            setLoading(false);
          });
    }, []);

    const toggleConnectionStatus = () => {
        setConnectionStatus(prev => {
            if (prev === 'disconnected') {
                return 'connecting';
            } else if (prev === 'connecting') {
                return 'connected';
            } else {
                return 'disconnected';
            }
        });
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) return;

        // Filter nodes by label and value (case insensitive)
        const filteredNodes = dataFlow.nodes.filter(node =>
            node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Filter edges connected to filtered nodes
        const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
        const filteredEdges = dataFlow.edges.filter(edge =>
            filteredNodeIds.has(edge.from) || filteredNodeIds.has(edge.to)
        );
        setDataFlow({
            nodes: filteredNodes,
            edges: filteredEdges
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
                    <SearchBar onSearch={handleSearch} />
                    <button onClick={toggleConnectionStatus}>
                        Toggle Connection Status (Current: {connectionStatus})
                    </button>
                </header>
                <section className="content">
                    <Routes>
                        <Route
                            path="/"
                            element={<DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />}
                        />
                        <Route path="/graph" element={<Graph />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;
