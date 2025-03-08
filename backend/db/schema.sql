-- Create tables for nodes and edges
CREATE TABLE IF NOT EXISTS nodes (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    "group" INTEGER NOT NULL,
    value TEXT,
    "isAI" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS edges (
    id SERIAL PRIMARY KEY,
    source INTEGER REFERENCES nodes(id),
    target INTEGER REFERENCES nodes(id),
    value TEXT,
    UNIQUE(source, target)
);

-- Insert sample data
INSERT INTO nodes (label, "group", value, "isAI") VALUES
    ('Node 1', 1, 'Example value', FALSE),
    ('Node 2', 2, 'Another value', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO edges (source, target, value) VALUES
    (1, 2, 'Connection between 1 and 2')
ON CONFLICT DO NOTHING;
