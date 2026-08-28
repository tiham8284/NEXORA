import http.server
import socketserver
import os
import sys

PORT = 5173
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

class SPATypeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Resolve requested file path in DIST_DIR
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            # Check if there is an index.html in the subdirectory
            if os.path.isdir(path) and os.path.exists(os.path.join(path, "index.html")):
                return super().do_GET()
            # Otherwise, fallback to root index.html for Single Page Application routing
            self.path = "/index.html"
        return super().do_GET()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIST_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), SPATypeHandler) as httpd:
        print(f"Server live at: http://localhost:{PORT}")
        print(f"Network access: http://127.0.0.1:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
