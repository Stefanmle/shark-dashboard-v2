import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { initData, stopWatcher } from './data.ts';
import apiRouter from './routes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PORT = parseInt(process.env.PORT || '3001', 10);
const XLS_PATH = process.env.XLS_PATH || path.resolve(ROOT, 'data/GSAF5.xls');
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

app.use(compression());
app.use('/api', apiRouter);

// Initialize data + file watcher
try {
  initData(XLS_PATH);
} catch (err) {
  console.error(`Failed to process XLS at ${XLS_PATH}:`, err);
  process.exit(1);
}

// Export for Vercel serverless
export default app;

// Local / standalone production server
if (!process.env.VERCEL) {
  if (!isDev) {
    const distPath = path.resolve(ROOT, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, () => {
    console.log(`Shark API running on http://localhost:${PORT}`);
    if (isDev) console.log('Dev mode — Vite dev server handles frontend');
    else console.log('Production — serving dist/ for frontend');
  });

  process.on('SIGTERM', () => {
    stopWatcher();
    server.close();
  });
}
