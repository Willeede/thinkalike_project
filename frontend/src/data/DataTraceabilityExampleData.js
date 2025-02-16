// src/frontend/src/data/DataTraceabilityExampleData.js
const dataFlow = {
  // Example data structure
  nodes: [
    { id: 'node1', label: 'Start' },
    { id: 'node2', label: 'Process' },
    { id: 'node3', label: 'End' }
  ],
  edges: [
    { from: 'node1', to: 'node2' },
    { from: 'node2', to: 'node3' }
];

export default dataFlow;
