import React, { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  useEffect(() => {
    fetch("http://localhost:3002/api/v1/graph/graph")
      .then(response => response.json())
      .then(data => {
        // Transform for ForceGraph with enhanced properties
        const graphData = {
          nodes: data.nodes.map(node => ({
            ...node,
            // Add display properties
            size: node.isAI ? 12 : 8,
            color: node.isAI ? "#FF6B6B" : "#4DABF7",
            fontSize: 14
          })),
          links: data.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            value: edge.value,
            color: "#66728E"
          }))
        };
        
        setGraphData(graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle node highlighting on hover
  const handleNodeHover = node => {
    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();
    
    if (node) {
      newHighlightNodes.add(node);
      
      // Get connected nodes and links
      graphData.links.forEach(link => {
        if (link.source.id === node.id || link.target.id === node.id) {
          newHighlightLinks.add(link);
          if (link.source.id !== node.id) newHighlightNodes.add(link.source);
          if (link.target.id !== node.id) newHighlightNodes.add(link.target);
        }
      });
    }
    
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  };

  // Generate node color based on highlight status
  const getNodeColor = node => {
    if (highlightNodes.size === 0) {
      return node.isAI ? "#FF6B6B" : "#4DABF7";
    }
    
    return highlightNodes.has(node) 
      ? (node.isAI ? "#FF0000" : "#007BFF") 
      : "#AAAAAA";
  };

  // Generate link color based on highlight status
  const getLinkColor = link => 
    highlightLinks.has(link) ? "#333333" : "#DDDDDD";

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading ThinkAlike Graph...</h2>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            margin: "20px auto",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "20px", 
        fontFamily: "Arial, sans-serif", 
        color: "#721c24", 
        backgroundColor: "#f8d7da", 
        border: "1px solid #f5c6cb",
        borderRadius: "5px",
        margin: "20px"
      }}>
        <h2>Error Loading Graph</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px"
    }}>
      <header style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        borderBottom: "2px solid #eaeaea",
        paddingBottom: "20px"
      }}>
        <h1 style={{ 
          color: "#333", 
          fontSize: "2.5em",
          margin: "0"
        }}>
          ThinkAlike
        </h1>
        <p style={{ color: "#666" }}>Interactive Knowledge Graph</p>
      </header>

      <div style={{ 
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
      }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={node => `${node.label}: ${node.value}`}
          nodeColor={getNodeColor}
          nodeRelSize={8}
          linkColor={getLinkColor}
          linkWidth={link => highlightLinks.has(link) ? 3 : 1}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={link => highlightLinks.has(link) ? 4 : 0}
          linkDirectionalParticleSpeed={0.01}
          linkLabel={link => link.value}
          onNodeHover={handleNodeHover}
          cooldownTime={2000}
          height={600}
          backgroundColor="#FAFAFA"
        />
      </div>

      <div style={{ 
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "30px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#4DABF7",
            borderRadius: "50%",
            marginRight: "10px"
          }}></div>
          <span>Human Component</span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#FF6B6B",
            borderRadius: "50%",
            marginRight: "10px"
          }}></div>
          <span>AI Component</span>
        </div>
      </div>
    </div>
  );
}

export default App;
