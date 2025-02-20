import React, { useRef, useEffect, useState } from 'react'; // Import useRef and useEffect
import ForceGraph2D from 'react-force-graph-2d';
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

    const [pulsatingNode, setPulsatingNode] = useState(null);


  // Color mapping for node groups (based on style_guide.md)
  //  Expand this as you add more node types/groups
  const nodeColors = {
    1: '#FFC300', // Amber/Honey Yellow (Neutral) - e.g., User Input
    2: '#FF5733', // Deep Orange (Active) - e.g., API Request, Response
    3: '#800000', // Deep Ruby (Connection) - e.g., Database
    4: '#001F3F', // Dark Blue - e.g. AI Agent.
  };

    const getNodeColor = (node) => {
        if (node.isAI) {
          return pulsatingNode === node ?  '#FF5733' : '#001F3F'; //Dark blue, if not pulsating
        }
        return nodeColors[node.group] || '#CCCCCC'; //color by group
    }


    const fgRef = useRef(); // Add a ref for the force graph

    useEffect(() => {
      // Find the AI node.  Assumes there's only one!
      const aiNode = dataFlow.nodes.find(node => node.isAI);
      if (aiNode) {
          setPulsatingNode(aiNode);
        const interval = setInterval(() => {
          setPulsatingNode(prevNode => prevNode === aiNode ? null: aiNode);
        }, 750); // Toggle every 750ms

        return () => clearInterval(interval); // Cleanup interval
      }
    }, [dataFlow]);

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef} // Add the ref to the component
          graphData={dataFlow}
          nodeLabel="label"
          nodeAutoColorBy="group" //  Use for the *stroke* color, not the fill
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          linkColor={() => '#001F3F'}

          // Custom node rendering
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Montserrat`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw a circle
            const nodeSize = (node.isAI ? 12 : 8) / globalScale;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node); // Use the color mapping
            ctx.fill();

            // Draw the label
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);
          }}
            onNodeClick={(node) => {
                console.log("Node clicked:", node); // Log node data to console
            }}

        />
      </div>
    </div>
  );
}

export default DataTraceability;
