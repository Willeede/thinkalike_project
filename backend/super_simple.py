import os

# Create a simple test file
try:
    print("Starting test")
    with open("super_simple.txt", "w") as f:
        f.write("Test file created successfully\n")
        f.write(f"Current directory: {os.getcwd()}\n")
    print("File created")
except Exception as e:
    print(f"Error: {e}")
