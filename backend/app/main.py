from flask import Flask, jsonify

app = Flask(__name__)

# --- Placeholder API Endpoints (To be expanded) ---

@app.route('/')
def home():
    """
    Placeholder home route for the backend API.
    Currently returns a simple welcome message.
    Will be expanded to serve as API documentation or entry point later.
    """
    return jsonify({"message": "Welcome to the ThinkAlike Backend API! - (Placeholder)"})

@app.route('/api/feedback', methods=['POST'])
def receive_feedback():
    """
    Placeholder API endpoint for receiving user feedback.
    Currently just acknowledges feedback receipt.
    Will be expanded to handle actual feedback processing and storage later.
    """
    feedback_data = request.get_json() # Get JSON data from the request
    # In a real implementation, you would process and store this feedback data
    print("Received feedback:", feedback_data) # Placeholder - print to console for now
    return jsonify({"message": "Feedback received (Placeholder) - We value your input!"}), 201 # 201 Created status


@app.route('/api/data', methods=['GET'])
def get_sample_data():
    """
    Placeholder API endpoint for serving sample data.
    Currently returns a hardcoded sample dataset.
    Will be expanded to fetch data from database or AI services later.
    """
    sample_data = [
        {"id": 1, "name": "User 1", "value": "Data Point A"},
        {"id": 2, "name": "User 2", "value": "Data Point B"},
        {"id": 3, "name": "User 3", "value": "Data Point C"}
    ]
    return jsonify(sample_data)

# --- End Placeholder API Endpoints ---


if __name__ == '__main__':
    app.run(debug=True) # Run the Flask app in debug mode (for development)
