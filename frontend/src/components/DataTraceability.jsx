import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = useRef();
  const containerRef = useRef(); // For custom tooltip container
  const [animationTime, setAnimationTime] = useState(0);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Animation loop using d3ReheatSimulation
  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setAnimationTime(prevTime => prevTime + 1);
      if (fgRef.current && typeof fgRef.current.d3ReheatSimulation === 'function') {
        fgRef.current.d3ReheatSimulation();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    if (dataFlow?.nodes?.length) {
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [dataFlow, connectionStatus]);

  // Node color mapping
  const nodeColors = {
    1: '#FFC300', // User Query
    2: '#F86B03', // AI Processing
    3: '#800000', // Results
    4: '#001F3F', // Other AI
  };

  const getNodeColor = (node) =>
    node.isAI ? 'orange' : nodeColors[node.group] || '#CCCCCC';

  // Tooltip content for nodes
  const getNodeTooltip = (node) => `
    <div>
      <b>${node.label}</b><br/>
      Group: ${node.group}<br/>
      ${node.isAI ? '<b>AI Agent</b><br/>' : ''}
      Value: ${node.value || 'N/A'}<br/>
    </div>
  `;

  // Tooltip content for edges. Uses dataFlow.nodes.find()
  // to handle cases when edge.source/target is a string ID.
  const getEdgeTooltip = (edge) => {
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

  // Show/hide tooltip on node hover
  const handleNodeHover = (node) => {
    if (node) {
      setTooltipContent(getNodeTooltip(node));
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  };

  const handleLinkHover = (link) => {
    if (link) {
      setTooltipContent(getEdgeTooltip(link));
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  };

  // Update tooltip position based on mouse movement within the container
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (tooltipVisible) {
        setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [tooltipVisible]);

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
      <div
        className="data-traceability-graph"
        ref={containerRef}
        style={{ position: 'relative', width: '800px', height: '600px' }}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes: dataFlow.nodes, links: dataFlow.edges }}
          nodeLabel="label"
          nodeAutoColorBy="group"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          linkColor={() => 'white'}
          linkDirectionalArrowColor={() => 'white'}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Montserrat`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';

            // Base node size per group
            let nodeSize = (node.isAI ? 12 : 8) / globalScale;

            // Pulsating effect for AI nodes:
            if (node.isAI) {
              // Use oscillation between 0.8 and 1.2 for a more visible size change.
              const pulsate = 1 + Math.sin(animationTime * 0.05) * 0.2; // oscillates between 0.8 and 1.2
              nodeSize *= pulsate;
              // Create an interpolation factor (0 to 1) for color based on the pulsation value.
              const interp = (pulsate - 0.8) / 0.4;
              const r = Math.floor(
                parseInt('#F86B03'.slice(1, 3), 16) * interp +
                parseInt('#FFC300'.slice(1, 3), 16) * (1 - interp)
              );
              const g = Math.floor(
                parseInt('#F86B03'.slice(3, 5), 16) * interp +
                parseInt('#FFC300'.slice(3, 5), 16) * (1 - interp)
              );
              const b = Math.floor(
                parseInt('#F86B03'.slice(5, 7), 16) * interp +
                parseInt('#FFC300'.slice(5, 7), 16) * (1 - interp)
              );
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
              ctx.fillStyle = getNodeColor(node);
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);
          }}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          onNodeClick={node => {
            console.log("Node clicked:", node);
          }}
        />

        {/* Custom Tooltip (rendered conditionally) */}
        {tooltipVisible && (
          <div
            className="custom-tooltip"
            style={{
              position: 'fixed',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '8px',
              borderRadius: '4px',
              fontFamily: 'sans-serif',
              maxWidth: '250px',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
            dangerouslySetInnerHTML={{ __html: tooltipContent }}
          />
        )}
      </div>
    </div>
  );
}

export default DataTraceability;
