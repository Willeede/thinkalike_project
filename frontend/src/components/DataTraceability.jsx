import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './DataTraceability.css';

const DataTraceability = () => {
    const [graphData, setGraphData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fgRef = useRef();

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/graph/graph')
            .then(response => response.json())
            .then(data => {
                // Transform the data structure for ForceGraph2D
                const transformedData = {
                    nodes: data.nodes.map(node => ({
                        ...node,
                        id: node.id.toString() // Ensure IDs are strings
                    })),
                    links: data.edges.map(edge => ({
                        source: edge.from.toString(),
                        target: edge.to.toString(),
                        value: edge.value
                    }))
                };
                console.log('Graph data:', transformedData);
                setGraphData(transformedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error.toString());
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="graph-loading">Loading...</div>;
    if (error) return <div className="graph-error">{error}</div>;
    if (!graphData) return <div>No data available</div>;

    return (
        <div className="data-traceability">
            <div className="data-traceability-graph" style={{ height: '600px', width: '100%' }}>
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    nodeLabel={node => node.label}
                    nodeColor={node => node.isAI ? '#00FFFF' : '#FFC300'}
                    nodeRelSize={8}
                    linkColor={() => '#CCCCCC'}
                    linkWidth={2}
                    linkDirectionalParticles={2}
                    backgroundColor="#000000"
                />
            </div>
        </div>
    );
};

export default DataTraceability;
