import psycopg2
import os
from dotenv import load_dotenv
import json

load_dotenv()

def verify_schema():
    try:
        db_url = os.environ.get("DATABASE_URL")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # Verify nodes schema
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'nodes'
            ORDER BY ordinal_position;
        """)
        print("\nNodes table schema:")
        for row in cur.fetchall():
            print(f"- {row[0]}: {row[1]} (Nullable: {row[2]})")

        # Verify nodes data
        cur.execute("""
            SELECT
                id::integer,
                label::varchar,
                "group"::integer,
                value::text,
                "isAI"::boolean
            FROM nodes
            ORDER BY id;
        """)
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            nodes.append({
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai)
            })
        print("\nNodes data:")
        print(json.dumps(nodes, indent=2))

        # Verify edges data
        cur.execute("""
            SELECT
                source::integer,
                target::integer,
                value::text
            FROM edges
            ORDER BY source, target;
        """)
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edges.append({
                "from": str(source),
                "to": str(target),
                "value": value
            })
        print("\nEdges data:")
        print(json.dumps(edges, indent=2))

        cur.close()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_schema()
