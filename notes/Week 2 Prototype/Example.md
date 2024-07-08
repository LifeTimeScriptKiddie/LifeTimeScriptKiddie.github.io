https://www.lanmaster53.com/2023/02/01/prototype-polution-in-flask/

```python

# A global object that will be susceptible to prototype pollution
from flask import Flask, request, jsonify

app = Flask(__name__)

# A global object that will be susceptible to prototype pollution
global_object = {}

def recursive_pollution(obj, key, value):
    keys = key.split('.')
    for k in keys[:-1]:
        if k not in obj:
            obj[k] = {}
        obj = obj[k]
    obj[keys[-1]] = value

@app.route('/get', methods=['GET'])
def get_handler():
    param = request.args.get('param')
    if param:
        global_object[param] = 'default'
    return jsonify(global_object)

@app.route('/post', methods=['POST'])
def post_handler():
    data = request.get_json()
    if data:
        for key, value in data.items():
            if key == "__proto__":
                global_object.__proto__ = value  # This line allows prototype pollution
            else:
                recursive_pollution(global_object, key, value)
    return jsonify(global_object)

if __name__ == '__main__':
    app.run(debug=True)


```