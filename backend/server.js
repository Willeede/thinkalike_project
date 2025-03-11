const express = require("express");
const cors = require("cors");

const app = express();

// Very permissive CORS settings
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Test endpoint
app.get("/test", (req, res) => {
  // Send proper JSON with correct headers
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ status: "ok", message: "API is working" }));
});

// Graph data endpoint
app.get("/api/v1/graph/graph", (req, res) => {
  // Set proper content type
  res.setHeader("Content-Type", "application/json");
  
  // Data to return
  const data = {
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
  
  // Send as JSON
  res.send(JSON.stringify(data));
});

// Catch-all route
app.use("*", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(404).send(JSON.stringify({ error: "Route not found" }));
});

const port = 3002;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
  console.log(`Graph endpoint: http://localhost:${port}/api/v1/graph/graph`);
});
