import React from 'react';

function DataTraceability({ dataFlow }) {
  return (
    <div>
      <h2>Data Traceability</h2>
      {/* Render nodes */}
      <h3>Nodes</h3>
      <ul>
        {dataFlow.nodes.map((node) => (
          <li key={node.id}>
            <strong>ID:</strong> {node.id} | <strong>Label:</strong> {node.label}
          </li>
        ))}
      </ul>
      {/* Render edges */}
      <h3>Edges</h3>
      <ul>
        {dataFlow.edges.map((edge, index) => (
          <li key={index}>
            <strong>From:</strong> {edge.from} → <strong>To:</strong> {edge.to}
          </li>
        ))}
      </ul>
      {/* If desired, show the entire dataFlow object as a JSON string */}
      <pre>{JSON.stringify(dataFlow, null, 2)}</pre>
    </div>
  );
}

export default DataTraceability;
