const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const HOST = '127.0.0.1';
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function resolvePath(requestUrl) {
  const { pathname } = new URL(requestUrl, `http://${HOST}:${PORT}`);
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const targetPath = path.normalize(path.join(ROOT, safePath));

  if (!targetPath.startsWith(ROOT)) {
    return null;
  }

  return targetPath;
}

async function sendFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  const body = await fs.readFile(filePath);
  response.writeHead(200, {
    'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  response.end(body);
}

async function handler(request, response) {
  try {
    const filePath = resolvePath(request.url || '/');

    if (!filePath) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }

    await sendFile(filePath, response);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Server error');
  }
}

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`Protein Classroom app running at http://${HOST}:${PORT}`);
  });
}

module.exports = server;
