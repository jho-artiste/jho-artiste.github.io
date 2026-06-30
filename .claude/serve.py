import http.server, socketserver, functools, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
with socketserver.TCPServer(("127.0.0.1", 4321), Handler) as httpd:
    httpd.serve_forever()
