import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function DataTraceability({ connectionStatus = 'disconnected' }) {
  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mapping (remains the same)
  const nodeColors = {
    1: '#FFC300',
    2: '#F86B03',
    3: '#800000',
    4: '#001F3F',
  };

  const getNodeColor = (node) => {
    if (node.isAI) {
      return '#F86B03'; // pulsating color
    }
    return nodeColors[node.group] || '#CCCCCC'; // color by group
  };

  const getWaveformColor = () => {
    if (connectionStatus === 'connected') {
      return '#800000'; // Ruby Red
    } else if (connectionStatus === 'connecting') {
      return '#FF5733'; // Deep Orange
    } else {
      return '#001F3F'; // Dark Blue (AI)
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    setLoading(true); // Set loading to true when we start fetching
    setError(null); // Clear any previous errors

    fetch('https://thinkalike-backend.onrender.com/graph') // Use the correct endpoint path
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setGraphData(data);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error("Error fetching graph data:", error);
        setError(error.message); // Set error state
        setLoading(false); // Set loading to false even on error
      });
  }, []); // Empty dependency array means this runs *once* on mount

  // Animation effect using useEffect (remains mostly the same, but depends on connectionStatus)
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setAnimationTime(prevTime => prevTime + 1); // Increment time
      fgRef.current && fgRef.current.refresh(); // Force re-render
      animationFrameId = requestAnimationFrame(animate); // Request next frame
    };

    animationFrameId = requestAnimationFrame(animate); // Start animation

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [connectionStatus]); // Re-run animation when connectionStatus changes

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

  const getEdgeTooltip = (edge) => {
    return `
      <div>
        Source: ${edge.source.label}<br/>
        Target: ${edge.target.label}<br/>
        Value: ${edge.value || 'N/A'}
      </div>
    `;
  };

  if (loading) {
    return <div className="data-traceability">Loading...</div>;
  }

  if (error) {
    return <div className="data-traceability">Error: {error}</div>;
  }

  if (!graphData || !graphData.nodes || !graphData.edges) {
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
          graphData={graphData} // Use the fetched data
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
            ctx.fillStyle = 'white';

            let nodeSize = (node.isAI ? 12 : 8) / globalScale;

            // Pulsating effect for AI node
            if (node.isAI) {
              const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5;
              nodeSize += pulsate * 4 / globalScale;
              const r = Math.floor((parseInt('#F86B03'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
              const g = Math.floor((parseInt('#F86B03'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
              const b = Math.floor((parseInt('#F86B03'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node);
            ctx.fill();
            ctx.save();
            ctx.clip();

            // Sinusoidal Waveform (for AI node)
            if (node.isAI) {
              const waveWidth = nodeSize * 2.2;
              const waveHeight = nodeSize * 0.4;
              const numWaves = 3;
              const waveOffset = animationTime * 0.1;

              ctx.beginPath();
              ctx.strokeStyle = getWaveformColor();
              ctx.lineWidth = 2 / globalScale;
              ctx.moveTo(node.x - waveWidth / 2, node.y);

              for (let i = -waveWidth / 2; i <= waveWidth / 2; i += 1 / globalScale) {
                const x = node.x + i;
                const y = node.y + waveHeight * Math.sin((i / waveWidth) * Math.PI * numWaves + waveOffset);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
            }

            ctx.restore();

            // Triangle
            if (node.isAI && connectionStatus === 'connected') {
              const triangleSize = nodeSize * 0.7;
              const triangleHeight = triangleSize * Math.sqrt(3) / 2;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y - triangleSize / 2);
              ctx.lineTo(node.x - triangleSize / 2, node.y + triangleHeight / 2);
              ctx.lineTo(node.x + triangleSize / 2, node.y + triangleHeight / 2);
              ctx.closePath();
              ctx.fillStyle = '#800000';
              ctx.fill();
            }

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);

            // Set up tooltip content
            node.dataTipContent = getNodeTooltip(node);
            node.__rd3t_tooltip = node.dataTipContent;
          }}

          onNodeClick={(node) => {
            console.log("Node clicked:", node);
          }}
          onLinkHover={(link) => {
            fgRef.current.linkVisibility(l => l === link);
            if (link) {
              fgRef.current.tooltipContent(getEdgeTooltip(link));
            }
          }}
        />
        <ReactTooltip anchorSelect=".data-traceability-graph canvas"
                      getContent={(dataTip) => dataTip} place="top" />
      </div>
    </div>
  );
}

export default DataTraceability;
