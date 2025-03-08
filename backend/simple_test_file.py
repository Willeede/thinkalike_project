import os

# Get the absolute path for the file
file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_output.txt")

# Write to file with absolute path
with open(file_path, "w") as f:
    f.write("This is a test file\n")
    f.write(f"Current directory: {os.getcwd()}\n")
    f.write(f"File location: {file_path}\n")

    # Try to list files in current directory
    f.write("\nFiles in current directory:\n")
    for filename in os.listdir(os.getcwd()):
        f.write(f"- {filename}\n")

print(f"Test file created at: {file_path}")
