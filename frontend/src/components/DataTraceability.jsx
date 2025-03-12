import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function DataTraceability({ dataFlow, connectionStatus }) {
    const fgRef = useRef();
    const [animationTime, setAnimationTime] = useState(0);

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            setAnimationTime(prevTime => prevTime + 1);
            fgRef.current && fgRef.current.refresh();
            animationFrameId = requestAnimationFrame(animate);
        };

        if (dataFlow?.nodes?.length) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [dataFlow, connectionStatus]);


  // Color mapping for node groups
  const nodeColors = {
    1: '#FFC300',   // User Query - Amber/Honey Yellow
    2: '#F86B03',   // AI Processing - Deep Orange
    3: '#800000',   // Results - Deep Ruby
    4: '#001F3F',   // Dark Blue - For other AI agents, if any.
  };

  // Function to get node color based on group and isAI status
  const getNodeColor = (node) => {
     if (node.isAI) {
          return 'orange'; // Orange, pulsating
    }
    return nodeColors[node.group] || '#CCCCCC'; // Default to light grey
  };

    const getWaveformColor = () => {
    if (connectionStatus === 'connected') {
      return '#800000'; // Ruby Red.
    } else if (connectionStatus === 'connecting') {
      return '#FF5733'; // Deep Orange.
    } else {
      return '#001F3F'; // Dark Blue (AI).
    }
  };

  // Function to generate tooltip content for nodes
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
    if (!dataFlow || !dataFlow.nodes || !dataFlow.edges) {
        return (
          <div className="data-traceability">
            <p>No data flow to display.</p>
          </div>
        );
    }

  // Render the graph
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
                linkColor={() => '#001F3F'} // Consistent dark blue for links

                // Custom node rendering
                  nodeCanvasObject={(node, ctx, globalScale) => {
                      const label = node.label;
                      const fontSize = 12 / globalScale;
                      ctx.font = `${fontSize}px Montserrat`; // Use a consistent font
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillStyle = 'white'; // White text

                      let nodeSize = (node.isAI ? 12 : 8) / globalScale;

                      // Pulsating effect for AI node.  This MUST be inside the nodeCanvasObject
                      if (node.isAI) {
                          const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5; // Oscillates between 0 and 1
                          nodeSize *= pulsate; // Adjust pulsation amplitude

                          // Color interpolation (pulsating)
                          const r = Math.floor((parseInt('#F86B03'.slice(1, 3), 16) * pulsate) + (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate)));
                          const g = Math.floor((parseInt('#F86B03'.slice(3, 5), 16) * pulsate) + (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate)));
                          const b = Math.floor((parseInt('#F86B03'.slice(5, 7), 16) * pulsate) + (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate)));
                          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                      }

                      // Draw node circle
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                      ctx.fillStyle = getNodeColor(node); // Use getNodeColor for *all* nodes
                      ctx.fill();

                      // Draw the label *below* the node
                      ctx.fillStyle = 'white'; // White text
                      ctx.fillText(label, node.x, node.y + fontSize * 1.5); // Position label below

                      // Set up tooltips
                      node.dataTipContent = getNodeTooltip(node);
                      node.__rd3t_tooltip = node.dataTipContent; // For react-tooltip
                }}
                  onLinkHover={(link) => {
                  if(fgRef.current) {
                      fgRef.current.linkVisibility(l => l === link);
                      if (link) {
                      fgRef.current.tooltipContent(getEdgeTooltip(link));
                      }
                  }
              }}
              />
              <ReactTooltip
                anchorSelect=".data-traceability-graph canvas"
                getContent={(dataTip) => dataTip}
                place="top"
              />

        </div>
      </div>
    );
}

export default DataTraceability;
