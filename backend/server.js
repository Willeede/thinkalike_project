const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*'
}));

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

const port = 3002;
app.listen(port, () => console.log(`Server running on port ${port}`));
