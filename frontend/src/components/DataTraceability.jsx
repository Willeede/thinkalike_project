import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);

  // Memoized node colors to prevent recreation on each render
  const nodeColors = useMemo(() => ({
    1: '#FFC300', // User Query - Amber
    2: '#F86B03', // AI Processing - Orange
    3: '#800000', // Results - Ruby
    4: '#001F3F', // Other agents - Dark Blue
  }), []);

  // FIXED: Animation effect with compatible methods
  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();

    const animate = () => {
      // Use a smoother time calculation
      const elapsedTime = Date.now() - startTime;
      setAnimationTime(elapsedTime);

      // Force refresh for animation - using methods that exist in this version
      if (fgRef.current) {
        // d3ReheatSimulation is a safer alternative to refresh()
        if (typeof fgRef.current.d3ReheatSimulation === 'function') {
          fgRef.current.d3ReheatSimulation();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if(dataFlow?.nodes?.length) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [dataFlow]);

  // Memoized functions to prevent recreation on each render
  const getNodeColor = useCallback((node) => {
    if (selectedNode === node) return '#32CD32';
    if (node.isAI) return 'orange';
    return nodeColors[node.group] || '#CCCCCC';
  }, [nodeColors, selectedNode]);

  const getNodeTooltip = useCallback((node) => `
    <div class="node-tooltip">
      <h3>${node.label}</h3>
      <p>Group: ${node.group}</p>
      ${node.isAI ? "<p><b>AI Agent</b></p>" : ""}
      <p>Value: ${node.value || 'N/A'}</p>
    </div>
  `, []);

  const getEdgeTooltip = useCallback((edge) => {
    const sourceNode = dataFlow.nodes.find(n => n.id === edge.source);
    const targetNode = dataFlow.nodes.find(n => n.id === edge.target);
    return `
      <div class="edge-tooltip">
        <p><b>Connection</b></p>
        <p>Source: ${sourceNode ? sourceNode.label : 'Unknown'}</p>
        <p>Target: ${targetNode ? targetNode.label : 'Unknown'}</p>
        <p>Value: ${edge.value || 'N/A'}</p>
      </div>
    `;
  }, [dataFlow]);

  // Optimized node hover handler
  const handleNodeHover = useCallback(node => {
    if (!node) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    // Find connected links and nodes
    const connectedLinks = dataFlow.edges.filter(link =>
      link.source === node.id || link.target === node.id
    );

    const connectedNodes = new Set();
    connectedNodes.add(node);

    connectedLinks.forEach(link => {
      const sourceNode = dataFlow.nodes.find(n => n.id === link.source);
      const targetNode = dataFlow.nodes.find(n => n.id === link.target);
      if (sourceNode) connectedNodes.add(sourceNode);
      if (targetNode) connectedNodes.add(targetNode);
    });

    setHighlightLinks(new Set(connectedLinks));
    setHighlightNodes(connectedNodes);
  }, [dataFlow]);

  // Node selection with focus animation
  const handleNodeClick = useCallback(node => {
    if (selectedNode === node) {
      // Deselect if clicking the same node
      setSelectedNode(null);
      if (fgRef.current) {
        fgRef.current.centerAt();
        fgRef.current.zoom(4);
      }
    } else {
      setSelectedNode(node);
      if (fgRef.current) {
        // Animate to focus on clicked node
        fgRef.current.centerAt(node.x, node.y, 1000);
        fgRef.current.zoom(6, 1000);
      }
    }
  }, [selectedNode]);

  // Enhanced rendering
  if (!dataFlow?.nodes?.length) {
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      {selectedNode && (
        <div className="selected-node-info">
          <h3>Selected: {selectedNode.label}</h3>
          <button onClick={() => setSelectedNode(null)}>Clear Selection</button>
        </div>
      )}
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes: dataFlow.nodes, links: dataFlow.edges }}
          nodeRelSize={6}
          nodeLabel={node => node.label}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkWidth={link => highlightLinks.has(link) ? 2.5 : 1.5}
          linkColor={link => highlightLinks.has(link) ? '#ff9900' : '#001F3F'}

          // Enhanced interactivity
          enableNodeDrag={true}
          enableZoomPanInteraction={true}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}

          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Montserrat`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Calculate node size with potential highlight effect
            let baseSize = (node.isAI ? 12 : 8);
            if (highlightNodes.has(node)) baseSize *= 1.4;
            if (selectedNode === node) baseSize *= 1.6;

            let nodeSize = baseSize / globalScale;

            // FIXED: Smoother pulsating effect for AI nodes
            if (node.isAI) {
              // Slower, more subtle pulsation
              const pulsate = Math.sin(animationTime * 0.001) * 0.3 + 0.7; // Range: 0.4-1.0 instead of 0-1
              nodeSize *= pulsate;

              // Color interpolation between two colors
              const r = Math.floor((parseInt('#F86B03'.slice(1, 3), 16) * pulsate) +
                                   (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
              const g = Math.floor((parseInt('#F86B03'.slice(3, 5), 16) * pulsate) +
                                   (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
              const b = Math.floor((parseInt('#F86B03'.slice(5, 7), 16) * pulsate) +
                                   (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
              ctx.fillStyle = getNodeColor(node);
            }

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
            ctx.fill();

            // Add border for highlighted nodes
            if (highlightNodes.has(node) || selectedNode === node) {
              ctx.strokeStyle = selectedNode === node ? '#32CD32' : '#ffffff';
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            // Draw label below node with better positioning
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + nodeSize + (fontSize * 0.6));

            // Set tooltip data
            node.dataTipContent = getNodeTooltip(node);
            node.__rd3t_tooltip = node.dataTipContent;
          }}

          linkCanvasObjectMode={() => 'after'}
          linkCanvasObject={(link, ctx, globalScale) => {
            // Only draw for hovered links
            if (!highlightLinks.has(link)) return;

            const start = link.source;
            const end = link.target;

            // Draw link label at midpoint
            const textPos = {
              x: start.x + (end.x - start.x) / 2,
              y: start.y + (end.y - start.y) / 2
            };

            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Montserrat`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(link.value || 'link', textPos.x, textPos.y);

            // Set tooltip for link
            link.dataTipContent = getEdgeTooltip(link);
          }}
        />
        <ReactTooltip
          anchorSelect=".data-traceability-graph canvas"
          getContent={(dataTip) => dataTip}
          place="top"
          className="graph-tooltip"
        />
      </div>
      <div className="graph-controls">
        <button onClick={() => fgRef.current && fgRef.current.zoomToFit(400)}>
          Zoom to Fit
        </button>
        <button onClick={() => fgRef.current && fgRef.current.d3Force('charge').strength(-120)}>
          Spread Nodes
        </button>
        <button onClick={() => fgRef.current && fgRef.current.d3Force('charge').strength(-30)}>
          Compact Nodes
        </button>
      </div>
    </div>
  );
}

export default DataTraceability;

