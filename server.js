import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Initialize database connection
let db = null;
let dbConnected = false;

// Try to connect to database
async function initDb() {
  try {
    const pg = await import('pg').catch(() => null);
    if (!pg) return null;
    
    const Pool = pg.Pool || (pg.default && pg.default.Pool);
    if (!Pool) return null;
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb',
    });
    
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    db = pool;
    dbConnected = true;
    return pool;
  } catch (err) {
    console.log('Database connection failed:', err.message);
    dbConnected = false;
    return null;
  }
}

async function createServer() {
  const app = express();
  app.use(compression());
  app.use(express.json());

  // Try to initialize database
  await initDb();

  // API endpoints
  const apiRouter = express.Router();
  
  // Status endpoint to report DB connection
  apiRouter.get('/status', (req, res) => {
    res.json({
      dbConnected,
      serverTime: new Date().toISOString()
    });
  });
  
  // Simple API routes that just report connection status
  apiRouter.get('/users', (req, res) => {
    if (dbConnected && db) {
      db.query('SELECT * FROM users')
        .then(result => res.json(result.rows))
        .catch(err => res.status(500).json({ 
          error: 'Database error', 
          message: err.message 
        }));
    } else {
      res.status(503).json({ message: 'Database not connected' });
    }
  });
  
  apiRouter.get('/users/:id', (req, res) => {
    if (!dbConnected || !db) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const id = parseInt(req.params.id);
    db.query('SELECT * FROM users WHERE id = $1', [id])
      .then(result => {
        if (result.rows.length) {
          res.json(result.rows[0]);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      })
      .catch(err => res.status(500).json({ error: 'Database error', message: err.message }));
  });
  
  // Register the API router
  app.use('/api', apiRouter);

  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    app.use(sirv('dist/client', { gzip: true }));
  }

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template, render;
      
      if (!isProduction) {
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      const appHtml = await render(url);
      const html = template.replace('<!--app-html-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Database ${dbConnected ? 'connected' : 'not connected'}`);
  });
}

createServer();