import React, { useRef, useState, useEffect, useCallback } from 'react';
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
        return '#F86B03';
    }
    return nodeColors[node.group] || '#CCCCCC';
};

const getNodeTooltip = (node) => {
    return `
      <div style="text-align: center;">
        <strong>${node.label}</strong><br/>
        Group: ${node.group}<br/>
        ${node.isAI ? "<span style='color: red;'>AI Agent</span><br/>" : ""}
        Value: ${node.value || 'N/A'}<br/>
      </div>
    `;
};

const getEdgeTooltip = (edge) => {
    return `
      <div style="text-align: center;">
        <strong>Edge Info</strong><br/>
        From: ${edge.source}<br/>
        To: ${edge.target}<br/>
        Value: ${edge.value || 'N/A'}
      </div>
    `;
};

const DataTraceability = ({ dataFlow, connectionStatus }) => {
    const fgRef = useRef(null);
    const [animationTime, setAnimationTime] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const handleLinkHover = useCallback((link) => {
        if (fgRef.current && typeof fgRef.current.linkVisibility === 'function') {
            fgRef.current.linkVisibility(l => l === link);
            fgRef.current.tooltipContent(link ? getEdgeTooltip(link) : null);
        } else {
            console.warn("fgRef.current is not yet available or doesn't have linkVisibility");
        }
    }, []);

    useEffect(() => {
        let animationFrameId;
        const animate = () => {
            setAnimationTime(prev => prev + 1);
            if (fgRef.current && typeof fgRef.current.refresh === 'function') {
                fgRef.current.refresh();
            } else {
                console.warn("refresh() method is not available on fgRef.current");
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        if (isMounted && dataFlow?.nodes?.length) {
            animationFrameId = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrameId);
    }, [dataFlow, connectionStatus, isMounted]);

    if (!dataFlow?.nodes || !dataFlow?.edges) {
        return (
            <div className="data-traceability">
                <p>No data flow to display.</p>
            </div>
        );
    }

    const graphData = { nodes: dataFlow.nodes, links: dataFlow.edges };

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

                        let nodeSize = node.isAI ? 12 / globalScale : 8 / globalScale;
                        if (node.isAI) {
                            const pulsate = Math.sin(animationTime * 0.05) * 0.5 + 0.5;
                            nodeSize += (pulsate * 4) / globalScale;
                            const baseAIColor = '#F86B03';
                            const alternateColor = '#FFC300';
                            const r = Math.floor(
                                parseInt(baseAIColor.slice(1, 3), 16) * pulsate +
                                parseInt(alternateColor.slice(1, 3), 16) * (1 - pulsate)
                            );
                            const g = Math.floor(
                                parseInt(baseAIColor.slice(3, 5), 16) * pulsate +
                                parseInt(alternateColor.slice(3, 5), 16) * (1 - pulsate)
                            );
                            const b = Math.floor(
                                parseInt(baseAIColor.slice(5, 7), 16) * pulsate +
                                parseInt(alternateColor.slice(5, 7), 16) * (1 - pulsate)
                            );
                            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                        } else {
                            ctx.fillStyle = getNodeColor(node);
                        }

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                        ctx.fill();

                        ctx.save();
                        ctx.clip();
                        ctx.restore();

                        ctx.fillStyle = 'white';
                        ctx.fillText(label, node.x, node.y + fontSize * 1.5);

                        node.dataTipContent = getNodeTooltip(node);
                        node.__rd3t_tooltip = node.dataTipContent;
                    }}
                    onNodeClick={(node) => {
                        console.log("Node clicked:", node);
                    }}
                    onLinkHover={handleLinkHover}
                    onRenderFrame={() => {
                        if (!isMounted) {
                            setIsMounted(true);
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
