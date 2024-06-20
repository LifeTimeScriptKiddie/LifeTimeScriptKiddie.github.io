from flask import Flask, jsonify, make_response, request

app = Flask(__name__)

@app.route('/api/data', methods=['GET', 'POST', 'OPTIONS'])
def api_data():
    if request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5000'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Max-Age'] = '86400'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    origin = request.headers.get('Origin')
    if origin == 'http://127.0.0.1:5000':
        if request.method == 'GET':
            response = make_response(jsonify(message="This is a GET request from a different origin with custom CORS headers."))
        elif request.method == 'POST':
            data = request.json
            response = make_response(jsonify(message="This is a POST request from a different origin with custom CORS headers.", data=data))
        
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        response.headers['Access-Control-Max-Age'] = '86400'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    else:
        return jsonify(message="CORS policy does not allow this origin."), 403

if __name__ == '__main__':
    app.run(port=5001)

