
Visual representation
![](../Screenshots/Pasted%20image%2020240614142821.png)
# What is Same-Origin Policy (SOP) ?
One of the web browser security mechanism. SOP restricts javascript on site A from accessing site B based on preset conditions. The conditions can be ports, url, domain, or scheme. 



# What is Cross-Origin Resource Sharing (CORS) ?
CORS allows javascript on a web browser to access resources from other sites. 
CORS headers can be noticed via `Access-Control-*` from request/response. 

CORS attack is very similar to XSS attack, the difference is CORS is intended to reach out to other domains and XSS is intended for the same domain. 
```

Access-Control-Request-Method: GET
Access-Control-Request-Headers: content-

Access-Control-Allow-Origin: http://127.0.0.1:5000
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true

```

Out of all those two headers are significantly important
`Access-Control-Allow-Origin : *` --> Indicates that the target website will trust requests from any origin. 

`Access-Control-Allow-Credentials : True`  --> Indicates the browser will send user's  cookies. Meaning attackers can ride the victim's session. 

---


Example using a premature Flask python scripts. 

app.py --> https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/SOP_CORS/app.py
![](../Screenshots/Pasted%20image%2020240614141150.png)
![](../Screenshots/Pasted%20image%2020240614141159.png)







Snapshot from 127.0.0.1:5000. Sending a Get request to http://127.0.0.1:5000/data. 
Observe there is no 'Origin' header in the request. This is a request that is reaching out to resource that is on the same network. 
![](../Screenshots/Pasted%20image%2020240614141500.png)



Script is as below. The get request is reaching out to http://127.0.0.1:5000/data. 
If this website is properly configured ( meaning if I knew how to build the website properly with some extra time), browsers could reach out to sub directories under /data. 
``` javascript
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

...


@app.route('/data')
def data():
    return jsonify(message="This is data from the same origin.")


```



___
Let's take a look at cors_app.py

cors_app.py --> https://raw.githubusercontent.com/LifeTimeScriptKiddie/LifeTimeScriptKiddie.github.io/main/notes/SOP_CORS/cors_app.py

Notice `Origin` and `Access-Control*` headers. 

![](../Screenshots/Pasted%20image%2020240614143302.png)

By changing Origin header, 

![](../Screenshots/Pasted%20image%2020240614143425.png)


Notice Options header. This is a preflight request to check what options are authorized. 
Caveat: Once again, this is man made feature. Meaning, it is up to the developer to set it up or not. 

![](../Screenshots/Pasted%20image%2020240614143612.png)

```javascript
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

```

# References

https://portswigger.net/web-security/cors/same-origin-policy
https://portswigger.net/web-security/cors#:~:text=Cross%2Dorigin%20resource%20sharing%20(CORS)%20is%20a%20browser%20mechanism,outside%20of%20a%20given%20domain.
