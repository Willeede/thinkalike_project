# ThinkAlike Troubleshooting Guide

## Frontend Troubleshooting

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

## Backend Troubleshooting

### **1. FastAPI Server Issues**

#### Server Won't Start
- **Check Python Environment**: Ensure you're using the correct virtual environment
  ```bash
  # Activate virtual environment
  cd backend
  .\venv\Scripts\activate  # Windows
  source venv/bin/activate  # macOS/Linux
  ```
- **Check Dependencies**: Verify all requirements are installed
  ```bash
  pip install -r requirements.txt
  ```
- **Check Port Availability**: Make sure port 8000 is not in use
  ```bash
  # Windows
  netstat -ano | findstr :8000

  # Linux/macOS
  lsof -i :8000
  ```
- **Check Logs**: Look for detailed error messages in the console output

#### API Endpoints Return 500 Errors
- **Enable Debug Mode**: Set `debug=True` in your FastAPI app
- **Check Database Connection**: Verify PostgreSQL connection string
- **Review Error Logs**: Check for exceptions in the server logs
- **Test With Simplified Endpoint**: Create a basic endpoint to isolate issues

### **2. Database Connection Issues**

#### Cannot Connect to PostgreSQL
- **Verify Environment Variables**:
  ```bash
  echo %DATABASE_URL%  # Windows
  echo $DATABASE_URL   # macOS/Linux
  ```
- **Check PostgreSQL Service**:
  ```bash
  # Windows
  sc query postgresql

  # Linux
  systemctl status postgresql

  # macOS
  brew services list | grep postgresql
  ```
- **Test Direct Connection**:
  ```bash
  psql "postgresql://username:password@localhost:5432/thinkalike"
  ```
- **Check Network Access**: Ensure firewall allows connections to PostgreSQL port

#### Database Schema Issues
- **Run Migration Scripts**: Apply any pending database migrations
- **Check Schema**: Verify table structure matches expected schema
  ```sql
  \d nodes
  \d edges
  ```
- **Reset Test Database**: Consider resetting to a known good state
  ```bash
  python backend/scripts/setup_database.py
  ```

### **3. Environment Setup Problems**

#### Missing Environment Variables
- **Create/Update .env File**: Ensure it contains all required variables
  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/thinkalike
  SECRET_KEY=your_secret_key
  DEBUG=True
  ```
- **Verify .env Loading**: Check that `load_dotenv()` is called early in application startup

#### SSL Certificate Issues
- **Development**: Disable SSL verification in development only
- **Production**: Ensure valid SSL certificates are configured

### **4. API Data Issues**

#### Graph Data Not Returned Correctly
- **Check Data Format**: Verify data format matches expected schema
- **Query Database Directly**: Compare direct query results with API response
  ```sql
  SELECT * FROM nodes LIMIT 10;
  SELECT * FROM edges LIMIT 10;
  ```
- **Add Detailed Logging**: Include additional log statements in your API handlers
- **Simplify Query**: Try retrieving a smaller subset of data

---

## Deployment Issues

### **1. Render Deployment**

#### Build Failures
- Check build logs for specific error messages
- Ensure buildpacks or Dockerfiles are configured correctly
- Verify that all dependencies are in requirements.txt or package.json

#### Runtime Errors
- Review application logs in the Render dashboard
- Check environment variables are set correctly
- Verify database connection strings for production

### **2. Cross-Origin (CORS) Issues**

#### API Requests Blocked by CORS
- Ensure CORS middleware is properly configured:
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://your-frontend-url.com", "http://localhost:3000"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
- Check browser console for specific CORS error messages
- Verify that the request origin matches the allowed origins list

---

## General Troubleshooting Tips

1. **Clear Cache**: Clear browser cache or try incognito mode
2. **Latest Code**: Ensure you have the latest code (`git pull`)
3. **Restart Services**: Sometimes restarting services solves unexplained issues
4. **Check Logs**: Always check application logs for clues
5. **Isolate Components**: Test frontend and backend separately to isolate issues

---

Feel free to update this guide as new issues and solutions are discovered.
