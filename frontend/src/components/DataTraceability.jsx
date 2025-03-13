import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);

  // useEffect for animation
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setAnimationTime(prevTime => prevTime + 1); // Increment time for smooth animation
      fgRef.current && fgRef.current.d3ReheatSimulation(); // FIXED: Use d3ReheatSimulation instead of refresh
      animationFrameId = requestAnimationFrame(animate); // Request next frame
    };

    if (dataFlow?.nodes?.length) { // Simplified checking
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId); // Cleanup animation on unmount
  }, [dataFlow, connectionStatus]); // Re-run effect if dataFlow changes

  // Color mapping for node groups
  const nodeColors = {
    1: '#FFC300', // User Query - Amber/Honey Yellow
    2: '#F86B03', // AI Processing - Deep Orange
    3: '#800000', // Results - Deep Ruby
    4: '#001F3F', // Dark Blue - For other AI agents, if any.
  };

  // Function to get node color based on group and isAI status
  const getNodeColor = (node) => {
    if (node.isAI) {
      return 'orange'; // Orange, pulsating
    }
    return nodeColors[node.group] || '#CCCCCC'; // Default to light grey
  };

  // Example usage if you needed a waveform color
  const getWaveformColor = () => {
    if (connectionStatus === 'connected') {
      return '#800000'; // Ruby Red
    } else if (connectionStatus === 'connecting') {
      return '#FF5733'; // Deep Orange
    } else {
      return '#001F3F'; // Dark Blue (AI)
    }
  };

  // Function to generate tooltip content for nodes
  const getNodeTooltip = (node) => {
    return `
      <div>
        <b>${node.label}</b><br/>
        Group: ${node.group}<br/>
        ${node.isAI ? "<b>AI Agent</b><br/>" : ""}
        Value: ${node.value || 'N/A'}<br/>
      </div>
    `;
  };

  // FIXED: Correctly lookup node objects by ID
  const getEdgeTooltip = (edge) => {
    // Link references node IDs, so find the matching node objects:
    const sourceNode = dataFlow.nodes.find(n => n.id === edge.source);
    const targetNode = dataFlow.nodes.find(n => n.id === edge.target);
    return `
        <div>
            Source: ${sourceNode ? sourceNode.label : 'Unknown'}<br/>
            Target: ${targetNode ? targetNode.label : 'Unknown'}<br/>
            Value: ${edge.value || 'N/A'}
        </div>
    `;
  };

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
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes: dataFlow.nodes, links: dataFlow.edges }}
          nodeLabel="label"
          nodeAutoColorBy="group"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          linkColor={() => '#001F3F'}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Montserrat`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let nodeSize = (node.isAI ? 12 : 8) / globalScale;

            // Pulsating effect for AI nodes
            if (node.isAI) {
              const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5; // Oscillates between 0 and 1
              nodeSize *= pulsate; // Adjust pulsation amplitude

              // Color interpolation (pulsating)
              const r = Math.floor((parseInt('#F86B03'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
              const g = Math.floor((parseInt('#F86B03'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
              const b = Math.floor((parseInt('#F86B03'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
              ctx.fillStyle = getNodeColor(node);
            }

            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw the label *below* the node
            ctx.fillStyle = 'white'; // White text
            ctx.fillText(label, node.x, node.y + fontSize * 1.5); // Position label below

            // Set up tooltips
            node.dataTipContent = getNodeTooltip(node);
            node.__rd3t_tooltip = node.dataTipContent; // For react-tooltip
          }}
          // onLinkHover prop removed to fix the error
        />
        <ReactTooltip
          anchorSelect=".data-traceability-graph canvas"
          getContent={(dataTip) => dataTip}
          place="top"
        />
      </div>
    </div>
  );
}

export default DataTraceability;

