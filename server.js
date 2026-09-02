import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleContactSubmission } from './server/apiHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually if exists without requiring external packages
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/(^['"]|['"]$)/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const PORT = process.env.PORT || 5000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf'
};

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API Endpoints
  if (url.pathname === '/api/contact' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });

    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const result = await handleContactSubmission(body, process.env);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // Static File Serving (for production dist)
  let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
  
  // If requesting without extension and directory doesn't exist, fallback to index.html (SPA)
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const spaFallback = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(spaFallback)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(spaFallback).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Royal Haven server running on port ${PORT}`);
});
