import React, { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState("unknown");
  const fgRef = useRef();

  // Color scheme
  const colors = {
    user: "#FDCB6E",    // Yellow for user nodes
    ai: "#81ECEC",      // Cyan for AI nodes
    result: "#FF7675",  // Red for result nodes
    links: "#2D3436",   // Dark gray for links
  };

  // Static data as fallback
  const staticData = {
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

  const loadStaticData = () => {
    console.log("Loading static fallback data");
    
    // Process static data
    const nodes = staticData.nodes.map(node => ({
      ...node,
      color: node.label.includes("User") 
        ? colors.user 
        : node.isAI 
          ? colors.ai 
          : node.label.includes("Result") 
            ? colors.result 
            : colors.user
    }));
    
    const links = staticData.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      value: edge.value,
      color: colors.links
    }));
    
    setGraphData({ nodes, links });
    setLoading(false);
    
    // Center the graph after a short delay
    setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400);
      }
    }, 500);
  };

  useEffect(() => {
    console.log("Checking backend status...");
    
    // First try to connect to the backend
    fetch("http://localhost:3002/test")
      .then(response => {
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Backend is running:", data);
        setBackendStatus("running");
        
        // Now fetch the graph data
        return fetch("http://localhost:3002/api/v1/graph/graph");
      })
      .then(response => {
        if (!response.ok) throw new Error(`Graph data status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Graph data received:", data);
        
        // Process the data for visualization
        const nodes = data.nodes.map(node => ({
          ...node,
          color: node.label.includes("User") 
            ? colors.user 
            : node.isAI 
              ? colors.ai 
              : node.label.includes("Result") 
                ? colors.result 
                : colors.user
        }));
        
        const links = data.edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          value: edge.value,
          color: colors.links
        }));
        
        setGraphData({ nodes, links });
        setLoading(false);
        
        // Center the graph after a short delay
        setTimeout(() => {
          if (fgRef.current) {
            fgRef.current.zoomToFit(400);
          }
        }, 500);
      })
      .catch(err => {
        console.error("Error:", err);
        setBackendStatus("error");
        setError(`${err.message}. Make sure the backend server is running on port 3002.`);
        
        // Use static data as fallback
        loadStaticData();
      });
  }, []);

  if (loading && backendStatus !== "error") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading ThinkAlike Graph</h2>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
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

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px"
    }}>
      <header style={{ 
        textAlign: "center", 
        marginBottom: "20px",
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
        
        {backendStatus === "error" && (
          <div style={{ 
            backgroundColor: "#fff3cd", 
            color: "#856404", 
            padding: "10px", 
            borderRadius: "4px",
            marginTop: "10px"
          }}>
            ⚠️ {error} Using static data.
          </div>
        )}
      </header>

      <div style={{ 
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        backgroundColor: "#fafafa",
        height: "600px"
      }}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel={node => `${node.label}: ${node.value}`}
          nodeColor={node => node.color}
          nodeRelSize={8}
          linkColor={link => link.color}
          linkWidth={2}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          linkCurvature={0.25}
          linkLabel={link => link.value}
          cooldownTime={2000}
        />
      </div>

      <div style={{ 
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "30px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: colors.user,
            borderRadius: "50%",
            marginRight: "10px"
          }}></div>
          <span>User Component</span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: colors.ai,
            borderRadius: "50%",
            marginRight: "10px"
          }}></div>
          <span>AI Component</span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: colors.result,
            borderRadius: "50%",
            marginRight: "10px"
          }}></div>
          <span>Result Component</span>
        </div>
      </div>
    </div>
  );
}

export default App;
