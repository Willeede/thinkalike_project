// frontend/src/components/DataTraceability.jsx

import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'


function DataTraceability({ dataFlow, connectionStatus = 'disconnected' }) { // Added connectionStatus prop
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
    2: '#F86B03', // Deep Orange (Active) - e.g., API Request, Response
    3: '#800000', // Deep Ruby (Connection) - e.g., Database
    4: '#001F3F', // Dark Blue - e.g. AI Agent.
  };

    const getNodeColor = (node) => {
        if (node.isAI) {
            return  '#F86B03' //pulsating color
        }
        return nodeColors[node.group] || '#CCCCCC'; //color by group
    }

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


  // Prepare tooltip content.  This is MUCH more readable.
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
          graphData={dataFlow}
          nodeLabel="label"
          nodeAutoColorBy="group"
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
            ctx.fillStyle = 'white';

            let nodeSize = (node.isAI ? 12 : 8) / globalScale;

            // Pulsating effect for AI node
            if (node.isAI) {
              const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5; // Oscillate between 0 and 1
              nodeSize += pulsate * 4 / globalScale; // Increase size by up to 4 pixels
                // color interpolation
                const r = Math.floor((parseInt('#F86B03'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
                const g = Math.floor((parseInt('#F86B03'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
                const b = Math.floor((parseInt('#F86B03'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            // ** Clipping (Important for Waveform) **
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node); // Use dynamic color
            ctx.fill();
            ctx.save(); // Save the current canvas state
            ctx.clip(); // Clip all subsequent drawing to the circle's shape

            // Sinusoidal Waveform (for AI node)
            if (node.isAI) {
              const waveWidth = nodeSize * 2.2;  //  <-- Slightly wider than the circle
              const waveHeight = nodeSize * 0.4; // Height of the waveform
              const numWaves = 3;             // Number of waves across the circle
              const waveOffset = animationTime * 0.1; //  Horizontal offset, based on time (for animation)

              ctx.beginPath();
              ctx.strokeStyle = getWaveformColor(); // Use the dynamic waveform color
              ctx.lineWidth = 2 / globalScale;
              ctx.moveTo(node.x - waveWidth / 2, node.y);

              for (let i = -waveWidth / 2; i <= waveWidth / 2; i += 1 / globalScale) {
                  // Calculate the y-coordinate of the sine wave
                  const x = node.x + i;
                  const y = node.y + waveHeight * Math.sin((i / waveWidth) * Math.PI * numWaves + waveOffset);
                  ctx.lineTo(x, y);
              }
              ctx.stroke();

              // Example: Drawing multiple waveforms (commented out by default)
              /*
              ctx.strokeStyle = '#003366'; // A slightly darker blue
              ctx.lineWidth = 1.5 / globalScale;
              ctx.beginPath();
              ctx.moveTo(node.x - waveWidth / 2, node.y);
              for (let i = -waveWidth / 2; i <= waveWidth / 2; i += 1 / globalScale) {
                  const x = node.x + i;
                  const y = node.y + (waveHeight * 0.7) * Math.sin((i / waveWidth) * Math.PI * (numWaves + 1) + waveOffset + 0.5); // Different frequency and offset
                  ctx.lineTo(x, y);
              }
              ctx.stroke();
              */
            }
            ctx.restore();
            //Triangle
              if (node.isAI && connectionStatus === 'connected') {
                const triangleSize = nodeSize * 0.7; // Adjust size as needed
                const triangleHeight = triangleSize * Math.sqrt(3) / 2; // For an equilateral triangle
                ctx.beginPath();
                ctx.moveTo(node.x, node.y - triangleSize / 2);
                ctx.lineTo(node.x - triangleSize / 2, node.y + triangleHeight / 2);
                ctx.lineTo(node.x + triangleSize / 2, node.y + triangleHeight / 2);
                ctx.closePath();
                ctx.fillStyle = '#800000'; // Deep Ruby for connection
                ctx.fill();
            }

            // Draw the label
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);

            // Set up tooltip content.
            node.dataTipContent = getNodeTooltip(node);
            node.__rd3t_tooltip = node.dataTipContent;//Required by the library
          }}
          onNodeClick={(node) => {
            console.log("Node clicked:", node); // Log node data to console, for testing.
          }}

            onLinkHover={(link) => { //Add hovering events
                // Display tooltip for edges.
                fgRef.current.linkVisibility(l => l === link);
                if(link) {
                    fgRef.current.tooltipContent(getEdgeTooltip(link));
                }
            }}

        />
        <ReactTooltip  anchorSelect=".data-traceability-graph canvas"
        getContent={(dataTip) => dataTip} place="top"/>
      </div>
    </div>
  );
}

export default DataTraceability;
