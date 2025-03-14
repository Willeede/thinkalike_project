import React, { useState, useEffect } from 'react';
import DataTraceability from './components/DataTraceability';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/graph/graph`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Check if data.nodes is defined and is an array
        if (!data.nodes || !Array.isArray(data.nodes)) {
          throw new Error("Invalid data format: 'nodes' is missing or not an array.");
        }

        // Check if data.edges is defined and is an array
        if (!data.edges || !Array.isArray(data.edges)) {
          throw new Error("Invalid data format: 'edges' is missing or not an array.");
        }

        // Ensure that all node IDs are strings
        const validNodes = data.nodes.every(node => typeof node.id === 'string');
        if (!validNodes) {
          throw new Error("Invalid data format: All node IDs must be strings.");
        }

        // Check if all nodes and edges have the required properties
        const hasNodes = data.nodes.length > 0; //check if node is not empty
        const nodesLength = data.nodes.length;
        const nodeIds = data.nodes.map(node => node.id);
        const hasEdges = data.edges.length > 0; //check if edges is not empty
        const edgesLength = data.edges.length;


        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ThinkAlike</h1>
        <h2>Data Traceability</h2>
      </header>
      <DataTraceability data={data} />
    </div>
  );
}

export default App;
