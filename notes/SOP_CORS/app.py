from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Enables Cross-origin Resource Sharing on all routes.
CORS(app)

@app.route('/')
def home():
    return '''
    <h1> SOP/CORS Demo </h1>
    <button onclick = "fetchData()"> SOP  </button>
    <p id = 'result'> </p>
    <button onclick = "fetchData_cors()"> CORS </button>
    <p id = 'result_cors'> </p>

    <script>
        function fetchData() {
            fetch('http://127.0.0.1:5000/data').then(response => response.json()).then(data => {document.getElementById('result').textContent = data.message;}).catch(error => {console.error('Error fetching data: ' , error);});}

        function fetchData_cors() {fetch('http://127.0.0.1:5001/api/data').then(response => response.json()).then(data => {document.getElementById('result_cors').textContent = data.message;}).catch(error => {console.error('Error Fetchinig data: ' , error);});}

    </script>
    '''


@app.route('/data')
def data():
    return jsonify(message = "this is data from the same origin.")

if __name__ == '__main__':
    app.run(port=5000)


