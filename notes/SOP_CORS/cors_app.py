from flask import Flask, jsonify, make_response, request

app = Flask(__name__)

@app.route('/api/data')
def api_data():
    origin = request.headers.get('Origin')
    if origin == 'http://127.0.0.1:5000':
        response = make_response(jsonify(message="This is data from a different origin with custom CORS headers."))
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Headers'] = 'content-type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Max-Age'] = '0'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    else:
        return jsonify(message="CORS policy does not allow this origin."), 403

if __name__ == '__main__':
    app.run(port=5001)

