import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Function to find the .env file in various possible locations
function findEnvFile() {
  const possiblePaths = [
    '.env',                      // Current directory
    '../.env',                   // One level up
  ];
  
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Found .env file at: ${envPath}`);
      return envPath;
    }
  }
  
  console.warn('No .env file found in any of the expected locations');
  return '.env'; // Default fallback
}

// Load environment variables with the correct path
dotenv.config({ path: findEnvFile() });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let isProduction = process.env.NODE_ENV === 'production';
let port = process.env.PORT || 3002;

// Initialize database connection
let db = null;
let dbConnected = false;
let server = null;
let currentDatabaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb';

// Function to reload environment variables
function reloadEnv() {
  const oldPort = port;
  const oldNodeEnv = process.env.NODE_ENV;
  const oldDatabaseUrl = currentDatabaseUrl;
  
  console.log('Reloading environment variables...');
  
  // Read env file directly to ensure we get fresh values
  try {
    const envConfig = dotenv.config({ override: true, path: findEnvFile() });
    console.log('Environment variables reloaded:', envConfig.parsed ? Object.keys(envConfig.parsed).length : 0, 'variables loaded');
  } catch (err) {
    console.error('Error reloading environment variables:', err.message);
  }
  
  // Update local variables that depend on env vars
  isProduction = process.env.NODE_ENV === 'production';
  port = process.env.PORT || 3002;
  const newDatabaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mydb';
  
  console.log('Environment variables comparison:');
  console.log(`- Port: ${oldPort} -> ${port}`);
  console.log(`- Node env: ${oldNodeEnv} -> ${process.env.NODE_ENV}`);
  console.log(`- Database URL changed: ${oldDatabaseUrl !== newDatabaseUrl}`);
  
  currentDatabaseUrl = newDatabaseUrl;
  
  // Check if critical server settings changed
  const serverSettingsChanged = 
    oldPort !== port || 
    oldNodeEnv !== process.env.NODE_ENV;
  
  // Check if database connection settings changed
  const dbSettingsChanged = oldDatabaseUrl !== currentDatabaseUrl;
  
  // If database connection string changed, force reconnection
  if (dbSettingsChanged) {
    console.log('Database connection string changed, reconnecting...');
    
    // Force database disconnect - use async/await with try/catch for clarity
    (async () => {
      if (db) {
        console.log('Closing existing database connection...');
        try {
          await db.end();
          console.log('Database connection closed successfully');
        } catch (err) {
          console.error('Error closing database connection:', err.message);
        }
        
        // Reset database state
        db = null;
        dbConnected = false;
        
        // Explicitly reconnect after disconnection is complete
        console.log('Initializing new database connection...');
        await initDb();
      } else {
        console.log('No existing database connection, connecting with new settings...');
        await initDb();
      }
    })();
  }
  
  // If critical settings changed, restart the server
  if (serverSettingsChanged && server) {
    console.log('Critical server settings changed, restarting server...');
    restartServer();
  }
  
  return process.env;
}

// Watch for changes in .env file - check multiple possible locations
const envFile = findEnvFile();
if (fs.existsSync(envFile)) {
  console.log(`Setting up file watcher for .env at: ${envFile}`);
  
  // More robust file watching
  let fsWait = false;
  try {
    fs.watch(envFile, { persistent: true }, (eventType, filename) => {
      if (eventType === 'change' && filename) {
        // Debounce
        if (fsWait) return;
        fsWait = setTimeout(() => { fsWait = false; }, 100);
        
        console.log(`.env file changed (${filename}), reloading environment variables`);
        reloadEnv();
      }
    });
    console.log(`Successfully watching .env file for changes at: ${envFile}`);
  } catch (err) {
    console.error(`Error setting up file watcher: ${err.message}`);
    
    // Fallback to interval-based checking for environments where fs.watch doesn't work well
    console.log('Setting up fallback interval-based file checking');
    let lastMtime = fs.statSync(envFile).mtime.getTime();
    
    setInterval(() => {
      try {
        const currentMtime = fs.statSync(envFile).mtime.getTime();
        if (currentMtime > lastMtime) {
          console.log('.env file changed (detected by polling), reloading environment variables');
          lastMtime = currentMtime;
          reloadEnv();
        }
      } catch (err) {
        console.error(`Error checking file: ${err.message}`);
      }
    }, 1000);
  }
} else {
  console.warn(`Warning: .env file not found for watching at ${envFile}`);
}

// Try to connect to database
async function initDb() {
  try {
    const pg = await import('pg').catch(() => null);
    if (!pg) return null;
    
    const Pool = pg.Pool || (pg.default && pg.default.Pool);
    if (!Pool) return null;
    
    // Close previous connection if exists
    if (db) {
      try {
        await db.end();
        console.log('Closed previous database connection');
      } catch (err) {
        console.error('Error closing previous database connection:', err.message);
      }
      
      // Reset connection status
      db = null;
      dbConnected = false;
    }
    
    console.log(`Connecting to database with URL: ${currentDatabaseUrl.substring(0, currentDatabaseUrl.indexOf('@') > 0 ? currentDatabaseUrl.indexOf('@') : 10)}...`);
    
    const pool = new Pool({
      connectionString: currentDatabaseUrl,
      // Add a short connection timeout to fail fast if the connection can't be established
      connectionTimeoutMillis: 5000
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
      serverTime: new Date().toISOString(),
      port: port,
      nodeEnv: process.env.NODE_ENV
    });
  });
  
  // Endpoint to reload environment variables
  apiRouter.post('/reload-env', (req, res) => {
    const env = reloadEnv();
    res.json({ 
      success: true, 
      message: 'Environment variables reloaded',
      // Return non-sensitive environment variables
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
      dbConnected,
      databaseUrlChanged: process.env.DATABASE_URL !== currentDatabaseUrl,
      serverRestarting: port !== (req.socket.localPort || req.connection.localPort)
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

  // Start the server
  return new Promise((resolve) => {
    const newServer = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Database ${dbConnected ? 'connected' : 'not connected'}`);
      resolve(newServer);
    });
  });
}

// Start the server initially
createServer().then(newServer => {
  server = newServer;
});
