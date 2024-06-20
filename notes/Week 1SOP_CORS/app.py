from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enables Cross-origin Resource Sharing on all routes.
CORS(app)

@app.route('/')
def home():
    return '''
    <h1> SOP/CORS Demo </h1>
    <button onclick="fetchData()">Fetch Data (SOP)</button>
    <p id='result'></p>
    <button onclick="fetchData_cors('GET')">Fetch Data (CORS - GET)</button>
    <button onclick="fetchData_cors('POST')">Fetch Data (CORS - POST)</button>
    <p id='result_cors'></p>

    <script>
        function fetchData() {
            fetch('http://127.0.0.1:5000/data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').textContent = data.message;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }

        function fetchData_cors(method) {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (method === 'POST') {
                options.body = JSON.stringify({ key: 'value' });  // Add body for POST requests
            }

            fetch('http://127.0.0.1:5001/api/data', options)
            .then(response => response.json())
            .then(data => {
                document.getElementById('result_cors').textContent = data.message;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    </script>
    '''

@app.route('/data')
def data():
    return jsonify(message="This is data from the same origin.")

if __name__ == '__main__':
    app.run(port=5000)

