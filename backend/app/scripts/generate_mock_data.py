import random
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def generate_mock_data(num_nodes=50, num_edges=75):
    """Generate mock data for testing the visualization with larger datasets."""
    
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL not configured")
        return
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Clear existing data
    cur.execute("TRUNCATE nodes CASCADE;")
    cur.execute("TRUNCATE edges CASCADE;")
    
    # Generate nodes
    node_types = ['User', 'API', 'Database', 'Model', 'Document', 'Service']
    ai_types = ['GPT-4', 'Claude', 'Gemini', 'Llama', 'DALL-E', 'MidJourney']
    
    for i in range(1, num_nodes + 1):
        is_ai = random.random() < 0.3  # 30% chance of being AI
        group = random.randint(1, 4)
        
        if is_ai:
            label = f"{random.choice(ai_types)} Node {i}"
            value = f"AI model with confidence {random.random():.2f}"
        else:
            label = f"{random.choice(node_types)} {i}"
            value = f"Sample value for node {i}"
        
        cur.execute(
            "INSERT INTO nodes (id, label, \"group\", value, \"isAI\") VALUES (%s, %s, %s, %s, %s)",
            (i, label, group, value, is_ai)
        )
    
    # Generate edges
    edge_values = [
        'data flow', 'API call', 'database query', 'authentication', 
        'user input', 'processing', 'response', 'error handling'
    ]
    
    for i in range(1, num_edges + 1):
        source = random.randint(1, num_nodes)
        target = random.randint(1, num_nodes)
        
        # Avoid self-loops
        while target == source:
            target = random.randint(1, num_nodes)
            
        value = f"{random.choice(edge_values)} #{i}"
        
        cur.execute(
            "INSERT INTO edges (id, source, target, value) VALUES (%s, %s, %s, %s)",
            (i, source, target, value)
        )
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"Successfully generated {num_nodes} nodes and {num_edges} edges")

if __name__ == "__main__":
    generate_mock_data()