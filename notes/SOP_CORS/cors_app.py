from flask import Flask, jsonify
from flask_cors import CORS

app= Flask(__name__)


cors = CORS(app,resources = {r"/api/*": {"origin": "*"}})

@app.route('/api/data')
def data():
    return jsonify(message = "this is data from a different origin.")

if __name__=='__main__':
    app.run(port=5001)
