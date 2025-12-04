from http.server import HTTPServer, SimpleHTTPRequestHandler

print("Starting demo server on port 8080...")
HTTPServer(("0.0.0.0", 8080), SimpleHTTPRequestHandler).serve_forever()