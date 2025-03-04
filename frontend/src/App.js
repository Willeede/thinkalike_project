import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Graph from './components/Graph';

function App() {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [dataFlow, setDataFlow] = useState({ nodes: [], edges: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Use the environment variable for the backend URL
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'; // Default to localhost for development

        fetch(`${backendUrl}/api/v1/graph/graph`) // Use absolute URL
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
                    {/* Example of using Link for navigation */}
                    <nav>
                      <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/graph">Graph</Link></li>
                        <li><Link to="/agent/agent">agent</Link></li>
                        <li><Link to="/feedback/feedback">feedback</Link></li>
                      </ul>
                    </nav>
                </header>
                <section className="content">
                    <Routes>
                        <Route path="/" element={<DataTraceability dataFlow={dataFlow} connectionStatus={connectionStatus} />} />
                        <Route path="/graph" element={<Graph />} />
                        {/*These routes are important for the router to work. The link address matches the route address,
                        which matches the get call on the backend.*/}
                        <Route path="/agent/agent" element={<div>Agent Route Content</div>} /> {/* Added route */}
                        <Route path="/feedback/feedback" element={<div>Feedback Route Content</div>} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </section>
            </div>
        </Router>
    );
}

export default App;