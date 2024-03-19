import requests
from sys import argv

port = 5000
if len(argv) > 1:
    port = int(argv[1])

r = requests.get('http://localhost:{}/'.format(port))
print(r.text)
