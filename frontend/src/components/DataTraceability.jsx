import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './DataTraceability.css';

const nodeColors = {
    1: '#FFC300',
    2: '#F86B03',
    3: '#800000',
    4: '#001F3F'
};

const getNodeColor = (node) => {
    if (node.isAI) {
        return '#F86B03'; // Base color for AI nodes (will be overridden by pulsating effect)
    }
    return nodeColors[node.group] || '#CCCCCC';
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

const DataTraceability = ({ dataFlow, connectionStatus }) => {
    const fgRef = useRef();
    const [animationTime, setAnimationTime] = useState(0);

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            setAnimationTime(prevTime => prevTime + 1);
            if (fgRef.current) {
                fgRef.current.refresh();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        if (dataFlow && dataFlow.nodes && dataFlow.nodes.length > 0) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [dataFlow, connectionStatus]);

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
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.label;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Montserrat`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'white';

                        let nodeSize = (node.isAI ? 12 : 8) / globalScale;

                        // Pulsating effect for AI nodes
                        if (node.isAI) {
                            const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5; // oscillates between 0 and 1
                            nodeSize += pulsate * 4 / globalScale; // adjust amplitude

                            // Color interpolation for pulsating effect
                            const r = Math.floor(
                                (parseInt('#F86B03'.slice(1, 3), 16) * pulsate) +
                                (parseInt('#FFC300'.slice(1, 3), 16) * (1 - pulsate))
                            );
                            const g = Math.floor(
                                (parseInt('#F86B03'.slice(3, 5), 16) * pulsate) +
                                (parseInt('#FFC300'.slice(3, 5), 16) * (1 - pulsate))
                            );
                            const b = Math.floor(
                                (parseInt('#F86B03'.slice(5, 7), 16) * pulsate) +
                                (parseInt('#FFC300'.slice(5, 7), 16) * (1 - pulsate))
                            );
                            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        }

                        // Draw node circle
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                        ctx.fillStyle = getNodeColor(node);
                        ctx.fill();
                        ctx.save();
                        ctx.clip();
                        ctx.restore();

                        // Draw node label beneath the node
                        ctx.fillStyle = 'white';
                        ctx.fillText(label, node.x, node.y + fontSize * 1.5);

                        // Set tooltip content
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
                <ReactTooltip
                    anchorSelect=".data-traceability-graph canvas"
                    getContent={(dataTip) => dataTip}
                    place="top"
                />
            </div>
        </div>
    );
};

export default DataTraceability;
