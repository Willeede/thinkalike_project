# ThinkAlike Frontend Troubleshooting Guide

This guide provides an overview of the expected behavior for the React frontend (which uses react-force-graph-2d) and detailed troubleshooting steps if the graph visualization isn't working as expected.

---

## 1. Expected Behavior

### **Display Nodes and Edges:**
- **Nodes:**
  - Nodes are fetched from the `/api/v1/graph/graph` endpoint.
  - Each node displays a label (from the `label` property) and is colored according to its group (using a predefined mapping).
  - If a node has the `isAI` property set to true, it should show a **pulsating effect**—its radius dynamically changes over time with color interpolation between two shades.

- **Edges:**
  - Edges are drawn as directional lines connecting nodes, with arrows indicating the flow from source to target.

### **Tooltips:**
- **Nodes:**
  - Hovering over a node should display a tooltip that includes the node’s label, group, value, and an “**AI Agent**” indicator (if applicable).

- **Edges:**
  - Hovering over an edge should display a tooltip with the source node’s label, the target node’s label, and the edge’s value. (Tooltips should reference node labels rather than raw IDs.)

### **Interaction:**
- Clicking a node logs its details to the browser’s console for debugging purposes.

---

## 2. Troubleshooting Steps

### **Step 1: Verify API Data (Directly)**
- Open a browser tab and navigate to:
  ```
  http://localhost:8000/api/v1/graph/graph
  ```
- Confirm that you receive a JSON response in the following format:
  ```json
  {
      "nodes": [
          { "id": "...", "label": "...", "group": ..., "value": "...", "isAI": ... },
          ... more nodes ...
      ],
      "edges": [
          { "from": "...", "to": "...", "value": "..." },
          ... more edges ...
      ]
  }
  ```
- **If the JSON is invalid or errors occur, fix the backend before troubleshooting the frontend.**

### **Step 2: Check Browser Developer Console (F12)**
- **Console Tab:**
  - Clear the console and reload the page.
  - Look for log messages (e.g., **“Fetching from:”**, **“Response status:”**, **“Data received:”**).
  - Review any JavaScript errors related to fetching data, useEffect, or rendering.

- **Network Tab:**
  - Filter by **Fetch/XHR**.
  - Reload the page and verify that the request to `/api/v1/graph/graph` returns **200 OK**.
  - Check that **Request URL** is `http://localhost:8000/api/v1/graph/graph`.
  - Ensure **Response Headers** include `Access-Control-Allow-Origin`.
  - Confirm that **Response Body** contains the expected JSON data.

### **Step 3: Verify App.js Code**
- In App.js, ensure the useEffect hook fetches the data properly:
  ```javascript
  useEffect(() => {
      const fetchData = async () => {
          try {
              setLoading(true);
              const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
              console.log("Fetching from:", API_BASE_URL);

              const response = await fetch(`${API_BASE_URL}/api/v1/graph/graph`);
              console.log("Response status:", response.status);

              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

              const data = await response.json();
              console.log("Data received:", data);

              setDataFlow(data);
              setConnectionStatus('connected');
          } catch (error) {
              console.error("Fetch error:", error);
              setError(error.message);
              setConnectionStatus('disconnected');
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);
  ```
- Verify `dataFlow` is passed as a prop to the DataTraceability component.

### **Step 4: Verify DataTraceability.jsx Code**
- Ensure the component uses ForceGraph2D correctly. The API data should be transformed into:
  ```javascript
  const graphData = { nodes: dataFlow.nodes, links: dataFlow.edges };
  ```
- Verify that tooltips (using `getNodeTooltip` and `getEdgeTooltip`) and the pulsating effect for AI nodes function properly.

### **Step 5: Confirm No Hardcoded API URLs**
- Check that the environment variable `REACT_APP_API_URL` is not forcing an incorrect URL. For local development, it should default to `http://localhost:8000` unless explicitly set.

---

By following these steps, you can isolate and correct issues with the graph visualization. This guide serves as both a diagnostic tool and a reference for ensuring our frontend renders while supplying dynamic interactivity.

---

Feel free to update this guide as needed.
