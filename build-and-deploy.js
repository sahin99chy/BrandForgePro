import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

console.log(`${colors.bright}${colors.cyan}=== BrandForge GitHub Pages Deployment ====${colors.reset}\n`);

// Step 1: Build the React app
console.log(`${colors.yellow}Building React application...${colors.reset}`);
try {
  execSync('npm run build:client', { stdio: 'inherit' });
  console.log(`${colors.green}✓ React build completed successfully${colors.reset}\n`);
} catch (error) {
  console.error('Error building React app:', error);
  process.exit(1);
}

// Step 2: Create necessary files for GitHub Pages
console.log(`${colors.yellow}Creating GitHub Pages configuration files...${colors.reset}`);

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy 404.html to dist
try {
  fs.copyFileSync(
    path.resolve(__dirname, 'public/404.html'),
    path.resolve(__dirname, 'dist/404.html')
  );
  console.log(`${colors.green}✓ Copied 404.html${colors.reset}`);
} catch (error) {
  console.error('Error copying 404.html:', error);
}

// Copy CNAME to dist if it exists
try {
  if (fs.existsSync(path.resolve(__dirname, 'public/CNAME'))) {
    fs.copyFileSync(
      path.resolve(__dirname, 'public/CNAME'),
      path.resolve(__dirname, 'dist/CNAME')
    );
    console.log(`${colors.green}✓ Copied CNAME${colors.reset}`);
  }
} catch (error) {
  console.error('Error copying CNAME:', error);
}

// Create a .nojekyll file to bypass Jekyll processing
try {
  fs.writeFileSync(path.resolve(__dirname, 'dist/.nojekyll'), '');
  console.log(`${colors.green}✓ Created .nojekyll file${colors.reset}\n`);
} catch (error) {
  console.error('Error creating .nojekyll file:', error);
}

// Step 3: Deploy to GitHub Pages
console.log(`${colors.yellow}Deploying to GitHub Pages...${colors.reset}`);
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log(`\n${colors.green}${colors.bright}✓ Successfully deployed to GitHub Pages!${colors.reset}`);
  console.log(`${colors.cyan}Your site should be available at: https://sahin99chy.github.io/BrandForgePro/${colors.reset}`);
  console.log(`${colors.yellow}Note: It may take a few minutes for changes to propagate.${colors.reset}`);
} catch (error) {
  console.error('Error deploying to GitHub Pages:', error);
  process.exit(1);
}
