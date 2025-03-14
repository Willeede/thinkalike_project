import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

function DataTraceability({ dataFlow, connectionStatus }) {
  const fgRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setAnimationTime((prevTime) => prevTime + 1);
      fgRef.current && fgRef.current.d3ReheatSimulation();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (dataFlow?.nodes?.length) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [dataFlow, connectionStatus]);

  const nodeColors = {
    1: '#FFC300',
    2: '#F86B03',
    3: '#800000',
    4: '#001F3F',
  };

 const getNodeColor = (node) =>
    node.isAI ? 'orange' : nodeColors[node.group] || '#CCCCCC';

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
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = getNodeColor(node);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + fontSize * 1.5);
            node.dataTipContent = getNodeTooltip(node);
          }}

        />


      </div>
    </div>
  );
}

export default DataTraceability;
