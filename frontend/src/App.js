import React, { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3002/api/v1/graph/graph")
      .then(response => response.json())
      .then(data => {
        // Transform data for force graph
        const formattedData = {
          nodes: data.nodes,
          links: data.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            value: edge.value
          }))
        };
        setGraphData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>ThinkAlike</h1>
      <div style={{ height: "600px", border: "1px solid #ddd" }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={node => `${node.label}: ${node.value}`}
          nodeColor={node => node.isAI ? "#ff6b6b" : "#4dabf7"}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
        />
      </div>
    </div>
  );
}

export default App;
