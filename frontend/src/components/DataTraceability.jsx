import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = React.useRef();
  const [animationTime, setAnimationTime] = React.useState(0);

  // Convert the dataFlow format to match what ForceGraph2D expects
  const graphData = React.useMemo(() => {
    if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
      return { nodes: [], links: [] };
    }
    return {
      nodes: dataFlow.nodes,
      links: dataFlow.edges.map(edge => ({
        source: edge.from,
        target: edge.to,
        value: edge.value
      }))
    };
  }, [dataFlow]);

  // Animation effect for pulsating effect
  React.useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setAnimationTime(prevTime => prevTime + 1);
      animationFrameId = requestAnimationFrame(animate);
    };
    if (dataFlow && dataFlow.nodes && dataFlow.edges && dataFlow.nodes.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [connectionStatus, dataFlow]);

  // If no graph data, show a placeholder message.
  if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

  // Color mapping for node groups
  const nodeColors = {
    1: '#FFC300',
    2: '#F86B03',
    3: '#800000',
    4: '#001F3F'
  };

  const getNodeColor = (node) => {
    if (node.isAI) {
      return '#F86B03';
    }
    return nodeColors[node.group] || '#CCCCCC';
  };

  const getWaveformColor = () => {
    if (connectionStatus === 'connected') {
      return '#800000';
    } else if (connectionStatus === 'connecting') {
      return '#FF5733';
    } else {
      return '#001F3F';
    }
  };

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

  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
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
            if (node.isAI) {
              const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5;
              nodeSize += (pulsate * 4) / globalScale;
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

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);
            node.dataTipContent = getNodeTooltip(node);
            node.__rd3t_tooltip = node.dataTipContent;
          }}
          onNodeClick={(node) => {
            console.log("Node clicked:", node);
          }}
          onLinkHover={(link) => {
            if (fgRef.current) {
              fgRef.current.linkVisibility(l => l === link);
              if (link) {
                fgRef.current.tooltipContent(getEdgeTooltip(link));
              }
            }
          }}
        />
        <Tooltip 
          anchorSelect=".data-traceability-graph canvas"
          getContent={(dataTip) => dataTip}
          place="top"
        />
      </div>
      <div className={`connection-status ${connectionStatus}`}>
        <p>Status: {connectionStatus}</p>
      </div>
    </div>
  );
}

export default DataTraceability;