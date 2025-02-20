const dataFlow = {
  nodes: [
    { id: 'node1', label: 'User Input', group: 1 },
    { id: 'node2', label: 'AI Agent', group: 4, isAI: true }, // AI Node
    { id: 'node3', label: 'Database', group: 3 },
    { id: 'node4', label: 'Response', group: 2 }
  ],
  edges: [
    { from: 'node1', to: 'node2' },
    { from: 'node2', to: 'node3' },
    { from: 'node3', to: 'node4' },
  ]
};

export default dataFlow;
