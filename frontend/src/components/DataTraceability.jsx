import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'


function DataTraceability({ dataFlow, connectionStatus = 'disconnected' }) { // Added connectionStatus prop, default to disconnected
  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);


  if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
    return (
      <div className="data-traceability">
        <p>No data flow to display.</p>
      </div>
    );
  }

    // Color mapping for node groups (based on style_guide.md)
    //  Expand this as you add more node types/groups
  const nodeColors = {
    1: '#FFC300', // Amber/Honey Yellow (Neutral) - e.g., User Input
    2: '#FF5733', // Deep Orange (Active) - e.g., API Request, Response
    3: '#800000', // Deep Ruby (Connection) - e.g., Database
    4: '#001F3F', // Dark Blue - e.g. AI Agent.
  };

    // Function to get node color based on group and connection status
    const getNodeColor = (node) => {
      if (node.isAI) {
        if (connectionStatus === 'connected') {
          return '#800000'; // Ruby Red for connected
        } else if (connectionStatus === 'connecting') {
          return '#FF5733'; // Deep Orange for connecting
        } else {
          return '#001F3F'; // Dark Blue for AI
        }
      }
      return nodeColors[node.group] || '#CCCCCC';
    };

    // Function to get waveform color based on connection status
    const getWaveformColor = () => {
        if (connectionStatus === 'connected') {
            return '#800000'; // Ruby Red
          } else if (connectionStatus === 'connecting') {
            return '#FF5733'; // Deep Orange
          } else {
            return '#001F3F'; // Dark Blue (AI)
          }
    };

  // Animation effect using useEffect
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setAnimationTime(prevTime => prevTime + 1); // Increment time
      fgRef.current && fgRef.current.refresh(); // Force re-render
      animationFrameId = requestAnimationFrame(animate); // Request next frame
    };

    animationFrameId = requestAnimationFrame(animate); // Start animation

    return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
  }, [connectionStatus]); // Add connectionStatus as a dependency


  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef}
          graphData={dataFlow}
          nodeLabel="label"
          nodeAutoColorBy="group"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          linkColor={() => '#001F3F'} // Default link color
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

              // color interpolation
              const r = Math.floor((parseInt('#FF5733'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
              const g = Math.floor((parseInt('#FF5733'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
              const b = Math.floor((parseInt('#FF5733'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            // Clipping (Important for Waveform)
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node); // Use dynamic color
            ctx.fill();
            ctx.save();
            ctx.clip();

            // Sinusoidal Waveform (for AI node)
            if (node.isAI) {
                const waveWidth = nodeSize * 2;
                const waveHeight = nodeSize * 0.4;
                const numWaves = 3;
                const waveOffset = animationTime * 0.1;

                ctx.beginPath();
                ctx.strokeStyle = getWaveformColor(); // Use dynamic color
                ctx.lineWidth = 2 / globalScale;
                ctx.moveTo(node.x - waveWidth / 2, node.y);

                for (let i = -waveWidth / 2; i <= waveWidth / 2; i += 1 / globalScale) {
                    const x = node.x + i;
                    const y = node.y + waveHeight * Math.sin((i / waveWidth) * Math.PI * numWaves + waveOffset);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }


              if (node.isAI && connectionStatus === 'connected') {
                const triangleSize = nodeSize * 0.7; // Adjust size as needed
                const triangleHeight = triangleSize * Math.sqrt(3) / 2;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y - triangleSize / 2);
                ctx.lineTo(node.x - triangleSize / 2, node.y + triangleHeight / 2);
                ctx.lineTo(node.x + triangleSize / 2, node.y + triangleHeight / 2);
                ctx.closePath();
                ctx.fillStyle = '#800000'; // Deep Ruby
                ctx.fill();
            }

            ctx.restore();

            // Draw the label
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);

            // Add tooltip content (data-tip attribute)
            node.__ ফোর্সGraphNode = true; // Required for react-tooltip
            node.dataTipContent = `${label}: ${node.value || 'No additional data'}`;

          }}
          onNodeClick={(node) => {
            console.log("Node clicked:", node);
          }}

        />
        <ReactTooltip anchorSelect=".data-traceability-graph canvas" getContent={(dataTip) => dataTip} place="top"/>
      </div>
    </div>
  );
}

export default DataTraceability;
