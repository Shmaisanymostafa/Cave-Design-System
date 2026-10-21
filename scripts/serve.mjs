// Tiny static server for previewing dist/ with clean URLs, like Firebase Hosting. Usage: node scripts/serve.mjs [port]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.wasm': 'application/wasm',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.dart': 'text/plain; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp',
};

async function find(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const base = path.normalize(path.join(root, clean));
  if (base !== root && !base.startsWith(root + path.sep)) return null;
  for (const candidate of [base, base + '.html', path.join(base, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch { /* try next */ }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const file = await find(req.url);
  const target = file || path.join(root, '404.html');
  try {
    const data = await readFile(target);
    res.writeHead(file ? 200 : 404, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${server.address().port}`));
