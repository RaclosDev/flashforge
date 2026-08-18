import urllib.request
import json

url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyC0y0oz2yQ8dOVicBHiGnfihA3u-7nM2_o"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        for model in data.get('models', []):
            print(model['name'])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
