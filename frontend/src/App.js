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

        fetch(`${API_BASE_URL}/api/v1/graph/test`)
          .then(response => {
            console.log("Response status:", response.status);
            return response.json();
          })
          .then(data => {
            console.log("Received API data:", data);
            setDataFlow(data);
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
        if (!searchTerm) {
            // If search is empty, reset to the original data
            setDataFlow(dataFlow);
            return;
        }
        
        // Filter nodes that match the search term (case insensitive)
        const filteredNodes = dataFlow.nodes.filter(node => 
            node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
            node.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Get IDs of filtered nodes
        const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
        
        // Filter edges that connect filtered nodes
        const filteredEdges = dataFlow.edges.filter(edge => 
            filteredNodeIds.has(edge.from) || filteredNodeIds.has(edge.to)
        );
        
        // Update the graph with filtered data
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

    console.log("Rendering main App component content");

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
