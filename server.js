const http = require('http');
const fs = require('fs');
const path = require('path');
const BASE = 'C:\\Users\\2023\\Desktop\\Mahra-master';
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
};
const server = http.createServer((req, res) => {
  const q = req.url.indexOf('?');
  const pathname = q >= 0 ? req.url.slice(0, q) : req.url;
  const filePath = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\//, '');
  const fullPath = path.join(BASE, filePath);
  const ext = path.extname(fullPath).toLowerCase();
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Content-Type', (MIME[ext] || 'application/octet-stream') + '; charset=utf-8');
   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
   fs.readFile(fullPath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); }
    else { res.writeHead(200); res.end(data); }
  });
});
server.listen(8080, '127.0.0.1', () => console.log(`Server: http://127.0.0.1:8080`));
