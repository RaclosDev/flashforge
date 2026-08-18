import urllib.request
import json

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyC0y0oz2yQ8dOVicBHiGnfihA3u-7nM2_o"
data = {
    "contents": [
        {
            "parts": [
                {"text": "Define casa"}
            ]
        }
    ]
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
