import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

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

  const nodeColors = {
    1: '#FFC300',
    2: '#FF5733',
    3: '#800000',
    4: '#001F3F',
  };

    const getNodeColor = (node) => {
        if (node.isAI) {
            return  '#FF5733' //pulsating color
        }
        return nodeColors[node.group] || '#CCCCCC';
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

            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fill();

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
