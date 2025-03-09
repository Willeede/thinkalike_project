-- Step 1: Clear existing data
DELETE FROM edges;
DELETE FROM nodes;

-- Step 2: Insert nodes and get auto-generated IDs
WITH inserted_nodes AS (
    INSERT INTO nodes (label, "group", value, "isAI") VALUES
    ('User Query', 1, 'Initial input', FALSE),
    ('AI Processing', 2, 'Analysis step', TRUE),
    ('Results', 3, 'Final output', FALSE)
    RETURNING id, label
)
-- Step 3: Insert edges using retrieved IDs
INSERT INTO edges (source, target, value)
SELECT
    (SELECT id FROM inserted_nodes WHERE label = 'User Query'),
    (SELECT id FROM inserted_nodes WHERE label = 'AI Processing'),
    'Process'
UNION ALL
SELECT
    (SELECT id FROM inserted_nodes WHERE label = 'AI Processing'),
    (SELECT id FROM inserted_nodes WHERE label = 'Results'),
    'Output';

-- Step 4: Verify data
SELECT * FROM nodes;
SELECT * FROM edges;
