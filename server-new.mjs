import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Helper function to get content type from file extension
function getContentType(extname) {
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return contentTypes[extname.toLowerCase()] || 'application/octet-stream';
}

// Create server
const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = parse(req.url || '/', true);
    
    // Path to the client's build directory
    const clientBuildPath = path.join(__dirname, 'client', 'dist');
    
    // Default to index.html for the root path
    let filePath = path.join(
      clientBuildPath,
      pathname === '/' ? 'index.html' : pathname
    );
    
    // Get file extension and set content type
    const extname = path.extname(filePath);
    const contentType = getContentType(extname);
    
    try {
      // Try to read the file
      const content = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File not found, try serving index.html for client-side routing
        if (!extname) {
          const indexHtml = path.join(clientBuildPath, 'index.html');
          const content = await fs.readFile(indexHtml);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          return res.end(content, 'utf-8');
        }
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        // Server error
        console.error('Error reading file:', err);
        res.writeHead(500);
        res.end('Server Error');
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server has been stopped');
    process.exit(0);
  });
});
