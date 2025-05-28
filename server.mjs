import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import archiver from 'archiver';

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

// Main request handler
async function handleRequest(req, res) {
  try {
    const { pathname, query } = parse(req.url || '', true);
    
    // Handle API endpoints
    if (pathname?.startsWith('/api/')) {
      return await handleApiRequest(req, res, pathname, query);
    }
    
    // Handle template downloads
    if (pathname?.startsWith('/templates/')) {
      return await handleTemplateRequest(req, res, pathname);
    }
    
    // Default to serving index.html for the root path
    const filePath = path.join(
      __dirname,
      'client',
      'dist',
      pathname === '/' ? 'index.html' : pathname || 'index.html'
    );
    
    const extname = path.extname(filePath);
    const contentType = getContentType(extname);
    
    try {
      const content = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        // Server error
        console.error('Server error:', err);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    }
  } catch (error) {
    console.error('Request handling error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

// Create HTTP server
const server = http.createServer(handleRequest);

// Handle API requests
function handleApiRequest(req, res, pathname, query) {
  // Handle all templates endpoint
  if (pathname === '/api/templates' && req.method === 'GET') {
    return getAllTemplates(req, res);
  }
  
  // Handle template download endpoint
  if (pathname === '/api/download-template' && req.method === 'GET') {
    const templateId = query.id;
    const isPremium = query.premium === 'true';
    const hasAccess = query.access === 'true';
    
    if (!templateId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Template ID is required' }));
    }
    
    // Check if premium and user has access
    if (isPremium && !hasAccess) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Premium template requires purchase' }));
    }
    
    // Determine template type and path
    const templateType = isPremium ? 'Premium Templates' : 'Free Templates';
    const templatePath = path.join(__dirname, 'templates', templateType, templateId);
    
    // Check if template exists
    if (!fs.existsSync(templatePath)) {
      // Try alternate paths if the template is not found
      const altTemplatePath = path.join(__dirname, 'templates', isPremium ? 'premium' : 'basic', templateId);
      if (fs.existsSync(altTemplatePath)) {
        // Use the alternate path if it exists
        return createTemplateZip(res, altTemplatePath, templateId);
      }
      
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Template not found' }));
    }
    
    return createTemplateZip(res, templatePath, templateId);
  }
  
  // Handle template metadata endpoint
  if (pathname === '/api/template-metadata' && req.method === 'GET') {
    const templateId = query.id;
    const templateType = query.type || 'free';
    
    if (!templateId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Template ID is required' }));
    }
    
    // Try to find the metadata file in different possible locations
    const possiblePaths = [
      path.join(__dirname, 'templates', templateType === 'premium' ? 'Premium Templates' : 'Free Templates', templateId, 'metadata.json'),
      path.join(__dirname, 'templates', templateType === 'premium' ? 'premium' : 'basic', templateId, 'metadata.json'),
      path.join(__dirname, 'templates', templateType, templateId, 'metadata.json')
    ];
    
    let metadataPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        metadataPath = p;
        break;
      }
    }
    
    // If no metadata file is found, generate one based on the template directory
    if (!metadataPath) {
      const templateDir = path.join(__dirname, 'templates', templateType === 'premium' ? 'Premium Templates' : 'Free Templates', templateId);
      if (fs.existsSync(templateDir)) {
        const metadata = generateTemplateMetadata(templateId, templateType, templateDir);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(metadata));
      }
      
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Template metadata not found' }));
    }
    
    // Read and return the metadata
    fs.readFile(metadataPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to read template metadata' }));
      }
      
      try {
        const metadata = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(metadata));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid metadata format' }));
      }
    });
    return;
  }
  
  // Handle payment verification endpoint (mock)
  if (pathname === '/api/verify-payment' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { templateId, paymentMethod, amount } = data;
        
        // In a real implementation, you would verify the payment with Stripe/PayPal
        // For now, we'll just simulate a successful payment
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Payment successful',
          templateId,
          transactionId: 'mock_' + Math.random().toString(36).substring(2, 15)
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request data' }));
      }
    });
    return;
  }
  
  // If no API endpoint matched
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

// Function to create a ZIP archive of a template
function createTemplateZip(res, templatePath, templateId) {
  // Create a zip archive of the template
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${templateId}.zip"`
  });
  
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compression level
  });
  
  // Pipe the archive to the response
  archive.pipe(res);
  
  // Add the template directory to the archive
  archive.directory(templatePath, false);
  
  // Finalize the archive
  archive.finalize();
  return;
}

// Function to get all templates
function getAllTemplates(req, res) {
  const templates = [];
  
  // Get free templates
  const freeTemplatesDir = path.join(__dirname, 'templates', 'Free Templates');
  const premiumTemplatesDir = path.join(__dirname, 'templates', 'Premium Templates');
  
  // Check if directories exist
  if (fs.existsSync(freeTemplatesDir)) {
    const freeTemplateFolders = fs.readdirSync(freeTemplatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Process each free template
    for (const templateId of freeTemplateFolders) {
      const templateDir = path.join(freeTemplatesDir, templateId);
      const metadata = getTemplateMetadata(templateId, 'free', templateDir);
      templates.push(metadata);
    }
  }
  
  // Get premium templates
  if (fs.existsSync(premiumTemplatesDir)) {
    const premiumTemplateFolders = fs.readdirSync(premiumTemplatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Process each premium template
    for (const templateId of premiumTemplateFolders) {
      const templateDir = path.join(premiumTemplatesDir, templateId);
      const metadata = getTemplateMetadata(templateId, 'premium', templateDir);
      templates.push(metadata);
    }
  }
  
  // Also check the basic and premium directories for backward compatibility
  const basicDir = path.join(__dirname, 'templates', 'basic');
  const premiumDir = path.join(__dirname, 'templates', 'premium');
  
  if (fs.existsSync(basicDir)) {
    const basicFolders = fs.readdirSync(basicDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const templateId of basicFolders) {
      const templateDir = path.join(basicDir, templateId);
      const metadata = getTemplateMetadata(templateId, 'free', templateDir);
      templates.push(metadata);
    }
  }
  
  if (fs.existsSync(premiumDir)) {
    const premiumFolders = fs.readdirSync(premiumDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const templateId of premiumFolders) {
      const templateDir = path.join(premiumDir, templateId);
      const metadata = getTemplateMetadata(templateId, 'premium', templateDir);
      templates.push(metadata);
    }
  }
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(templates));
}

// Function to get template metadata
function getTemplateMetadata(templateId, type, templateDir) {
  // Check if metadata.json exists
  const metadataPath = path.join(templateDir, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const data = fs.readFileSync(metadataPath, 'utf8');
      const metadata = JSON.parse(data);
      
      // Ensure required fields
      return {
        id: templateId,
        name: metadata.name || templateId,
        type: type,
        premium: type === 'premium' || metadata.premium === true,
        category: metadata.category || null,
        layout: metadata.layout || null,
        responsive: metadata.responsive !== false,
        graphics: metadata.graphics !== false,
        features: metadata.features || [],
        thumbnailUrl: `/templates/${type === 'free' ? 'Free Templates' : 'Premium Templates'}/${templateId}/thumbnail.jpg`,
        previewUrl: `/templates/${type === 'free' ? 'Free Templates' : 'Premium Templates'}/${templateId}/index.html`
      };
    } catch (e) {
      // If metadata.json is invalid, generate metadata
      return generateTemplateMetadata(templateId, type, templateDir);
    }
  } else {
    // If metadata.json doesn't exist, generate metadata
    return generateTemplateMetadata(templateId, type, templateDir);
  }
}

// Function to generate template metadata
function generateTemplateMetadata(templateId, type, templateDir) {
  // Generate a name from the template ID
  const name = templateId
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Check if index.html exists to determine features
  const indexPath = path.join(templateDir, 'index.html');
  let features = [];
  
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, 'utf8');
      
      // Extract features based on common sections
      if (content.includes('hero')) features.push('hero-section');
      if (content.includes('feature')) features.push('features-section');
      if (content.includes('testimonial')) features.push('testimonials');
      if (content.includes('pricing')) features.push('pricing-table');
      if (content.includes('contact')) features.push('contact-form');
      if (content.includes('gallery')) features.push('gallery');
    } catch (e) {
      // If we can't read the file, use default features
      features = ['basic-layout'];
    }
  }
  
  return {
    id: templateId,
    name: name,
    type: type,
    premium: type === 'premium',
    responsive: true,
    graphics: true,
    features: features,
    thumbnailUrl: `/templates/${type === 'free' ? 'Free Templates' : 'Premium Templates'}/${templateId}/thumbnail.jpg`,
    previewUrl: `/templates/${type === 'free' ? 'Free Templates' : 'Premium Templates'}/${templateId}/index.html`
  };
}

// Handle template file requests
function handleTemplateRequest(req, res, pathname) {
  // Map the URL path to the file system path
  const filePath = path.join(__dirname, pathname);
  
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }
  
  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  // Set the appropriate content type
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end(`Server Error: ${err.code}`);
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

// Function to handle template metadata request
function handleTemplateMetadataRequest(req, res, query) {
  if (!query.id) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Template ID is required' }));
    return;
  }
  const templateId = query.id;
  
  // Find template in both directories
  const freeTemplateDir = path.join(__dirname, 'client', 'public', 'templates', 'Free Templates');
  const premiumTemplateDir = path.join(__dirname, 'client', 'public', 'templates', 'Premium Templates');
  
  let metadata = getTemplateMetadata(templateId, 'free', freeTemplateDir);
  if (!metadata) {
    metadata = getTemplateMetadata(templateId, 'premium', premiumTemplateDir);
  }
  
  if (metadata) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metadata));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Template not found' }));
  }
}

// Main request handler
function handleRequest(req, res) {
  const { pathname, query } = parse(req.url, true);
  
  // Handle API routes
  if (pathname.startsWith('/api/')) {
    switch (pathname) {
      case '/api/template-metadata':
        handleTemplateMetadataRequest(req, res, query);
        break;
      case '/api/download-template':
        handleTemplateDownload(req, res, query);
        break;
      case '/api/verify-payment':
        handlePaymentVerification(req, res);
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
    return;
  }
  
  // Handle static file serving
  handleStaticFileRequest(req, res);
}
}

// Handle template download request
async function handleTemplateDownload(req, res, query) {
  const templateId = query.id;
  const isPremium = query.premium === 'true';
  const hasAccess = query.access === 'true';
  
  // Validate parameters
  if (!templateId) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Template ID is required' }));
  }
  
  // Check if premium template requires access
  if (isPremium && !hasAccess) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Access denied. Template requires purchase.' }));
  }
  
  // Determine template directory
  const templateType = isPremium ? 'Premium Templates' : 'Free Templates';
  const templateDir = path.join(__dirname, 'client', 'public', 'templates', templateType);
  const templatePath = path.join(templateDir, templateId);
  
  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Template not found' }));
  }
  
  // Create and send ZIP file
  try {
    await createTemplateZip(res, templatePath, templateId);
  } catch (error) {
    console.error('Error creating template ZIP:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to create template ZIP' }));
  }
}

// Handle payment verification
async function handlePaymentVerification(req, res) {
  // Get request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const { templateId, paymentMethod, amount } = JSON.parse(body);
      
      // Validate required fields
      if (!templateId || !paymentMethod || !amount) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
      }
      
      // In a real implementation, this would verify the payment with a payment processor
      // For demo purposes, we'll simulate a successful payment
      
      // Simulate processing delay
      setTimeout(() => {
        // Return success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Payment successful',
          templateId,
          transactionId: 'txn_' + Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString()
        }));
      }, 1500);
    } catch (error) {
      console.error('Error processing payment:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid request data' }));
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Open your browser to see the BrandForgePro demo`);
});
