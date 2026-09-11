import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { launch } from 'chrome-launcher';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportDirectory = resolve(root, 'lighthouse-reports');
const routes = [
  ['library', '/'],
  ['study', '/study.html?v=psalm-119-11'],
  ['long-study', '/study.html?v=colossians-3-12-14'],
];
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css',
  '.js': 'text/javascript', '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
};
let server;
let chrome;
let baseUrl = process.env.AUDIT_BASE_URL;

try {
  // Serve the unchanged static files when no deployment URL is supplied.
  if (!baseUrl) {
    server = createServer(async (request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const file = resolve(root, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
        if (!file.startsWith(root + sep)) {
          response.writeHead(403).end();
          return;
        }
        const content = await readFile(file);
        response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
        response.end(content);
      } catch {
        response.writeHead(404).end('Not found');
      }
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }

  await mkdir(reportDirectory, { recursive: true });
  // CHROME_PATH can select a local Chrome/Chromium installation. Keep normal
  // browser security enabled; root-only containers need the no-sandbox flag.
  chrome = await launch({
    chromeFlags: ['--headless', '--disable-dev-shm-usage',
      ...(process.getuid?.() === 0 ? ['--no-sandbox'] : [])],
  });
  const scores = [];
  for (const [name, route] of routes) {
    for (const device of ['mobile', 'desktop']) {
      const result = await lighthouse(new URL(route, baseUrl).href, {
        port: chrome.port, logLevel: 'error', output: ['html', 'json'],
      }, device === 'desktop' ? desktopConfig : undefined);
      if (!result || result.lhr.runtimeError) {
        throw new Error(result?.lhr.runtimeError?.message || 'Lighthouse did not return a report');
      }
      await writeFile(resolve(reportDirectory, `${name}-${device}.html`), result.report[0]);
      await writeFile(resolve(reportDirectory, `${name}-${device}.json`), result.report[1]);
      const row = { page: name, device };
      // Check every scored category, including categories added by Lighthouse.
      for (const [category, { score }] of Object.entries(result.lhr.categories)) {
        row[category] = score === null ? null : Math.round(score * 100);
        if (score === null || score < 0.95) process.exitCode = 1;
      }
      scores.push(row);
      console.log(row);
    }
  }
  await writeFile(resolve(reportDirectory, 'scores.json'), JSON.stringify(scores, null, 2) + '\n');
  console.log(process.exitCode ? 'FAIL: a category scored below 95.' : 'PASS: every category scored at least 95.');
} finally {
  if (chrome) await chrome.kill();
  if (server) await new Promise(resolve => server.close(resolve));
}
