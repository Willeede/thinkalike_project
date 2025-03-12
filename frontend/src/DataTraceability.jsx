import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

function DataTraceability() {
    const fgRef = useRef();
    const [animationTime, setAnimationTime] = useState(0); // State for animation
    
    // Sample data for the graph
    const dataFlow = {
        nodes: [
            { id: "3", label: "User Query", group: 1, value: "Initial input", isAI: false },
            { id: "4", label: "AI Processing", group: 2, value: "Analysis step", isAI: true },
            { id: "5", label: "Results", group: 3, value: "Final output", isAI: false }
        ],
        edges: [
            { source: "3", target: "4", value: "Process" },
            { source: "4", target: "5", value: "Output" }
        ]
    };
    
    const connectionStatus = 'connected';

    // Color mapping for node groups (Corrected mapping)
    const nodeColors = {
        1: '#FFC300',   // User Query - Amber/Honey Yellow
        2: '#F86B03',   // AI Processing - Deep Orange
        3: '#800000',   // Results - Deep Ruby
        4: '#001F3F',   // Dark Blue - For other AI agents, if any.
    };

    // Function to get node color based on group and isAI status
    const getNodeColor = (node) => {
      if (node.isAI) {
          return '#F86B03'; // Use Deep Orange for AI nodes initially
      }
      return nodeColors[node.group] || '#CCCCCC'; // Default to light grey
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

    // Function to generate tooltip content for edges
    const getEdgeTooltip = (edge) => {
        return `
            <div>
                Source: ${typeof edge.source === 'object' ? edge.source.label : 'Source'}<br/>
                Target: ${typeof edge.target === 'object' ? edge.target.label : 'Target'}<br/>
                Value: ${edge.value || 'N/A'}
            </div>
        `;
    };

    // Animation effect - using a different approach that doesn't rely on refresh()
    useEffect(() => {
        let animationFrameId;
        
        const animate = () => {
            setAnimationTime(prevTime => prevTime + 1);
            animationFrameId = requestAnimationFrame(animate);
        };
        
        // Start animation
        animationFrameId = requestAnimationFrame(animate);
        
        // Clean up
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Prepare graph data
    const graphData = {
        nodes: dataFlow.nodes.map(node => ({
            ...node,
            color: getNodeColor(node)
        })),
        links: dataFlow.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            value: edge.value
        }))
    };

    return (
        <div className="data-traceability">
            <h2>Data Traceability</h2>
            <div className="data-traceability-graph">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    backgroundColor="#000000" // Black background
                    linkColor={() => '#001F3F'} // Consistent dark blue for links
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    linkWidth={1.5}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.label;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Montserrat, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        let nodeSize = (node.isAI ? 12 : 8) / globalScale;
                        
                        // Pulsating effect for AI nodes
                        if (node.isAI) {
                            // Use animationTime for pulsating effect
                            const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5; // Oscillates between 0 and 1
                            nodeSize += pulsate * 4 / globalScale;
                            
                            // Color interpolation between Deep Orange and Amber Yellow
                            const r = Math.floor((parseInt('F8', 16) * pulsate) + (parseInt('FF', 16) * (1 - pulsate)));
                            const g = Math.floor((parseInt('6B', 16) * pulsate) + (parseInt('C3', 16) * (1 - pulsate)));
                            const b = Math.floor((parseInt('03', 16) * pulsate) + (parseInt('00', 16) * (1 - pulsate)));
                            
                            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        } else {
                            ctx.fillStyle = node.color; // Use node color
                        }
                        
                        // Draw node
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                        ctx.fill();
                        
                        // Add subtle glow for AI nodes
                        if (node.isAI) {
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, nodeSize * 1.4, 0, 2 * Math.PI, false);
                            ctx.fillStyle = 'rgba(248, 107, 3, 0.2)'; // Transparent orange glow
                            ctx.fill();
                        }
                        
                        // Draw label below node
                        ctx.fillStyle = '#FFFFFF'; // White text
                        ctx.fillText(label, node.x, node.y + nodeSize + fontSize);
                    }}
                    nodeLabel={getNodeTooltip}
                    linkLabel={getEdgeTooltip}
                    cooldownTime={3000}
                    onNodeClick={node => {
                        // Center on node
                        const distance = 40;
                        fgRef.current.centerAt(node.x, node.y, 1000);
                        fgRef.current.zoom(1.5, 1000);
                    }}
                />
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFC300', marginRight: '8px' }}></div>
                    <span>User Query</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#F86B03', marginRight: '8px' }}></div>
                    <span>AI Processing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#800000', marginRight: '8px' }}></div>
                    <span>Results</span>
                </div>
            </div>
        </div>
    );
}

export default DataTraceability;
