import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = useRef();
  const containerRef = useRef(); // Ref for the container div, for tooltips
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

  // Update tooltip position based on mouse movement in the container
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (tooltipVisible) {
        setTooltipPosition({ x: event.clientX + 15, y: event.clientY - 10 });
      }
    };

    // Attach to the container div, not the canvas itself
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [tooltipVisible]);

  if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
    console.log("DataTraceability: No data flow to display. dataFlow:", dataFlow)
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph" ref={containerRef}>
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

            let nodeSize = (node.isAI ? 12 : 8) / globalScale;
            let fillStyle = getNodeColor(node);
            if (node.isAI) {
              const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5;
              nodeSize *= pulsate;
              const r = Math.floor(
                parseInt('#F86B03'.slice(1, 3), 16) * pulsate +
                  parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)
              );
              const g = Math.floor(
                parseInt('#F86B03'.slice(3, 5), 16) * pulsate +
                  parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)
              );
              const b = Math.floor(
                parseInt('#F86B03'.slice(5, 7), 16) * pulsate +
                  parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)
              );
              fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + nodeSize + 2); // Position text below node
          }}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
        />
        {tooltipVisible && (
            <div className='custom-tooltip'
                style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                }}
                dangerouslySetInnerHTML={{ __html: tooltipContent }}
            />
        )}
      </div>
    </div>
  );
}

export default DataTraceability;
