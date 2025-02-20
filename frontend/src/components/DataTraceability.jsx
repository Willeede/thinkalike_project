import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css'; // Import CSS for styling

function DataTraceability({ dataFlow }) {

  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0); // State for animation

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

    const getNodeColor = (node) => {
        if (node.isAI) {
            return  '#FF5733' //pulsating color
        }
        return nodeColors[node.group] || '#CCCCCC'; //color by group
    }

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
  }, []);


  return (
    <div className="data-traceability">
      <h2>Data Traceability</h2>
      <div className="data-traceability-graph">
        <ForceGraph2D
          ref={fgRef} // Attach the ref
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
                const r = Math.floor((parseInt('#FF5733'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
                const g = Math.floor((parseInt('#FF5733'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
                const b = Math.floor((parseInt('#FF5733'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            // ** Clipping (Important for Waveform) **
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();  // Fill the circle *before* clipping
            ctx.save(); // Save the current canvas state
            ctx.clip(); // Clip all subsequent drawing to the circle's shape


            // Sinusoidal Waveform (for AI node)
            if (node.isAI) {
                const waveWidth = nodeSize * 2;  // Width of the waveform
                const waveHeight = nodeSize * 0.4; // Height of the waveform
                const numWaves = 3;             // Number of waves across the circle
                const waveOffset = animationTime * 0.1; //  Horizontal offset, based on time (for animation)

                ctx.beginPath();
                ctx.strokeStyle = '#001F3F'; // Dark Blue
                ctx.lineWidth = 2 / globalScale;

                // Start drawing the wave from the left side of the circle
                ctx.moveTo(node.x - waveWidth / 2, node.y);

                for (let i = -waveWidth / 2; i <= waveWidth / 2; i += 1 / globalScale) {
                    // Calculate the y-coordinate of the sine wave
                    const x = node.x + i;
                    const y = node.y + waveHeight * Math.sin((i / waveWidth) * Math.PI * numWaves + waveOffset);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            ctx.restore(); // Restore the canvas state (removes clipping)

            // Draw the label
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);
          }}

          onNodeClick={(node) => {
            console.log("Node clicked:", node);
          }}
        />
      </div>
    </div>
  );
}

export default DataTraceability;
