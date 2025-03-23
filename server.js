import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { createServer as createViteServer } from 'vite';
import mockData from './src/config/mockData.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Initialize database if needed
let db = null;
let useDbConnection = false;

// Try to connect to database if packages are installed
async function initDb() {
  try {
    // Only try to import pg if it's available
    const { Pool } = await import('pg');
    
    // Create pool with environment variables (automatically uses PG* env vars)
    const pool = new Pool();
    
    // Test the connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
    db = pool;
    useDbConnection = true;
    return pool;
  } catch (err) {
    console.log('Database connection failed or pg not installed. Using mock data instead.');
    console.error(err.message);
    useDbConnection = false;
    return null;
  }
}

async function createServer() {
  const app = express();
  app.use(compression());
  app.use(express.json());

  // Try to initialize database
  await initDb();

  // API endpoints for data
  const apiRouter = express.Router();
  
  // Get all users
  apiRouter.get('/users', async (req, res) => {
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
      } catch (err) {
        console.error('Error querying users:', err);
        res.json(mockData.users); // Fallback to mock data
      }
    } else {
      res.json(mockData.users);
    }
  });
  
  // Get user by ID
  apiRouter.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length) {
          res.json(result.rows[0]);
        } else {
          // User not found in DB, try mock data
          const user = mockData.users.find(u => u.id === id);
          if (user) {
            res.json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        }
      } catch (err) {
        console.error('Error querying user:', err);
        // Fallback to mock data
        const user = mockData.users.find(u => u.id === id);
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      }
    } else {
      const user = mockData.users.find(u => u.id === id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
  
  // Get all products
  apiRouter.get('/products', async (req, res) => {
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows);
      } catch (err) {
        console.error('Error querying products:', err);
        res.json(mockData.products); // Fallback to mock data
      }
    } else {
      res.json(mockData.products);
    }
  });
  
  // Get product by ID
  apiRouter.get('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length) {
          res.json(result.rows[0]);
        } else {
          // Product not found in DB, try mock data
          const product = mockData.products.find(p => p.id === id);
          if (product) {
            res.json(product);
          } else {
            res.status(404).json({ message: 'Product not found' });
          }
        }
      } catch (err) {
        console.error('Error querying product:', err);
        // Fallback to mock data
        const product = mockData.products.find(p => p.id === id);
        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      }
    } else {
      const product = mockData.products.find(p => p.id === id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    }
  });
  
  // Get all tasks
  apiRouter.get('/tasks', async (req, res) => {
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM tasks');
        res.json(result.rows);
      } catch (err) {
        console.error('Error querying tasks:', err);
        res.json(mockData.tasks); // Fallback to mock data
      }
    } else {
      res.json(mockData.tasks);
    }
  });
  
  // Get task by ID
  apiRouter.get('/tasks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length) {
          res.json(result.rows[0]);
        } else {
          // Task not found in DB, try mock data
          const task = mockData.tasks.find(t => t.id === id);
          if (task) {
            res.json(task);
          } else {
            res.status(404).json({ message: 'Task not found' });
          }
        }
      } catch (err) {
        console.error('Error querying task:', err);
        // Fallback to mock data
        const task = mockData.tasks.find(t => t.id === id);
        if (task) {
          res.json(task);
        } else {
          res.status(404).json({ message: 'Task not found' });
        }
      }
    } else {
      const task = mockData.tasks.find(t => t.id === id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    }
  });
  
  // Get all posts
  apiRouter.get('/posts', async (req, res) => {
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM posts');
        res.json(result.rows);
      } catch (err) {
        console.error('Error querying posts:', err);
        res.json(mockData.posts); // Fallback to mock data
      }
    } else {
      res.json(mockData.posts);
    }
  });
  
  // Get post by ID
  apiRouter.get('/posts/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (useDbConnection && db) {
      try {
        const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
        if (result.rows.length) {
          res.json(result.rows[0]);
        } else {
          // Post not found in DB, try mock data
          const post = mockData.posts.find(p => p.id === id);
          if (post) {
            res.json(post);
          } else {
            res.status(404).json({ message: 'Post not found' });
          }
        }
      } catch (err) {
        console.error('Error querying post:', err);
        // Fallback to mock data
        const post = mockData.posts.find(p => p.id === id);
        if (post) {
          res.json(post);
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      }
    } else {
      const post = mockData.posts.find(p => p.id === id);
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    }
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
    console.log(`API endpoints available at http://localhost:${port}/api`);
  });
}

createServer();