import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

function DataTraceability({ dataFlow }) {

  if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

  // Color mapping for node groups (based on style_guide.md)
  const nodeColors = {
    1: '#FFC300', // Amber/Honey Yellow (Neutral)
    2: '#FF5733', // Deep Orange (Active)
    3: '#800000', // Deep Ruby (Connection) -  Use for a specific "connected" node
  };

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph">
        <ForceGraph2D
          graphData={dataFlow}
          nodeLabel="label"
          nodeAutoColorBy="group" // We'll use this to *control* the color
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}

          // Custom node rendering
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale; // Adjust font size based on zoom
            ctx.font = `${fontSize}px Montserrat`; // Use Montserrat
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = nodeColors[node.group] || '#CCCCCC'; // Get color from mapping, default to light gray

            // Draw a circle
            const nodeSize = 8 / globalScale;   //Base size
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw the label
            ctx.fillStyle = 'white'; // White text (for good contrast)
            ctx.fillText(label, node.x, node.y + fontSize * 1.5); // Position label below the node
          }}
        />
      </div>
    </div>
  );
}

export default DataTraceability;
