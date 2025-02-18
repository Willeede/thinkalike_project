import React from 'react';
import './DataTraceability.css'; // Import CSS for styling

function DataTraceability({ dataFlow }) {

  // Check if dataFlow is provided and has nodes and edges
  if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      {/* Placeholder for the Node/Edge Graph Visualization */}
      <div className="data-traceability-graph">
        {/* TODO: Implement graph rendering here using a library like react-force-graph */}
      </div>

      {/*  Optional: Display nodes and edges as lists (for debugging)
      <h3>Nodes</h3>
      <ul>
        {dataFlow.nodes.map((node) => (
          <li key={node.id}>
            <strong>ID:</strong> {node.id} | <strong>Label:</strong> {node.label}
          </li>
        ))}
      </ul>

      <h3>Edges</h3>
      <ul>
        {dataFlow.edges.map((edge, index) => (
          <li key={index}>
            <strong>From:</strong> {edge.from} → <strong>To:</strong> {edge.to}
          </li>
        ))}
      </ul>
      */}

      {/*  Remove this in the final version - only for debugging
      <pre>{JSON.stringify(dataFlow, null, 2)}</pre>
      */}
    </div>
  );
}

export default DataTraceability;
