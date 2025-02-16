import sys
import os

print("Python sys.path:")
for path in sys.path:
    print(f"  - {path}")

try:
    from backend.agents.code_developer_agent import CodeDeveloperAgent
    print("\nImport from backend.agents.code_developer_agent successful!")
except ModuleNotFoundError as e:
    print(f"\nImport from backend.agents.code_developer_agent failed:")
    print(e)
