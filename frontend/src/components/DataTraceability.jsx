import React, { useRef, useMemo, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const DataTraceability = ({ dataFlow, connectionStatus }) => {
    const fgRef = useRef();
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('DataTraceability received data:', dataFlow);
        if (fgRef.current) {
            fgRef.current.d3Force('charge').strength(-100);
        }
    }, [dataFlow]);

    const nodeColors = {
        1: '#FFC300',
        2: '#F86B03',
        3: '#800000',
        4: '#001F3F',
    };

    const getNodeColor = (node) => {
        if (node.isAI) {
            return '#F86B03';
        }
        return nodeColors[node.group] || '#CCCCCC';
    };

    const graphData = useMemo(() => {
        if (!dataFlow?.nodes?.length) {
            return { nodes: [], links: [] };
        }

        try {
            // Create a set of valid node IDs
            const nodeIds = new Set(dataFlow.nodes.map(node => node.id));

            // Filter edges to only include those with valid node references
            const validEdges = (dataFlow.edges || []).filter(edge =>
                nodeIds.has(edge.source) && nodeIds.has(edge.target)
            );

            return {
                nodes: dataFlow.nodes,
                links: validEdges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    value: edge.value
                }))
            };
        } catch (err) {
            setError(`Error processing graph data: ${err.message}`);
            return { nodes: [], links: [] };
        }
    }, [dataFlow]);

    // Show connection status
    if (connectionStatus === 'disconnected') {
        return (
            <div className="connection-status disconnected">
                <p>Disconnected from server</p>
            </div>
        );
    }

    // Show error if present
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Show loading or no data message
    if (!graphData.nodes.length) {
        return <div className="no-data-message">No graph data available</div>;
    }

    return (
        <div className="data-traceability">
            <h2>Data Flow Visualization</h2>
            <div className="data-traceability-graph">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel={node => `${node.label}: ${node.value}`}
                    nodeColor={node => getNodeColor(node)}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    linkLabel={link => link.value}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.label;
                        const fontSize = 12/globalScale;
                        const nodeSize = 8; // Increased from 5

                        // Node circle
                        ctx.fillStyle = getNodeColor(node);
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
                        ctx.fill();

                        // Node border on hover
                        if (node.hover) {
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }

                        // Node label
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'white';
                        ctx.fillText(label, node.x, node.y + nodeSize + 8);

                        // Value text on hover
                        if (node.hover) {
                            ctx.fillText(node.value, node.x, node.y + nodeSize + 24);
                        }
                    }}
                    onNodeHover={node => {
                        fgRef.current.refresh();
                    }}
                />
                <ReactTooltip
                    anchorSelect=".data-traceability-graph canvas"
                    place="top"
                />
            </div>
        </div>
    );
};

export default DataTraceability;
