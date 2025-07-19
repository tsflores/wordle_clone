import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy for HTTPS behind reverse proxy
app.set('trust proxy', 1);

// Force HTTPS redirect
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
});

// CORS middleware - must come before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.json());

// Serve static files from the public directory with proper MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        // Set proper MIME types for JavaScript modules
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.get('/api/randomword', async (req, res) => {
  const url = `https://random-word-api.vercel.app/api?words=1&length=5`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
    });
    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from Random Word API' });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all handler: send back index.html for any non-API, non-static routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Don't serve index.html for static file requests (let them 404 properly)
    if (req.path.includes('.')) {
        return res.status(404).send('File not found');
    }
    
    // For everything else, serve index.html (SPA routing)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});