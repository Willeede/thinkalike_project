const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"]
    }
  }
}));

app.use(cors({
  origin: 'https://thinkalike-frontend.onrender.com',
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/api/v1/graph/graph', (req, res) => {
  res.json({
    nodes: [
      { id: '3', label: 'User Query', group: 1, value: 'Initial input', isAI: false },
      { id: '4', label: 'AI Processing', group: 2, value: 'Analysis step', isAI: true },
      { id: '5', label: 'Results', group: 3, value: 'Final output', isAI: false }
    ],
    edges: [
      { source: '3', target: '4', value: 'Process' },
      { source: '4', target: '5', value: 'Output' }
    ]
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
