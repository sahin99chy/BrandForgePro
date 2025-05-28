import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define template interface
interface TemplateMetadata {
  id: string;
  name: string;
  type: 'free' | 'premium';
  category?: string;
  description?: string;
  tags?: string[];
  features?: string[];
  previewImage?: string;
  previewUrl?: string;
  downloadUrl?: string;
  premium: boolean;
  industry?: string[];
  layout?: string;
  responsive?: boolean;
  graphics?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Function to process templates from a directory
async function processTemplates(
  baseDir: string,
  type: 'free' | 'premium',
  outputFile: string
): Promise<TemplateMetadata[]> {
  const templates: TemplateMetadata[] = [];
  const templateDirs = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const dir of templateDirs) {
    const templatePath = path.join(baseDir, dir);
    const metadataPath = path.join(templatePath, 'metadata.json');
    
    try {
      // Read metadata.json if it exists
      let metadata: Partial<TemplateMetadata> = {};
      if (fs.existsSync(metadataPath)) {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent);
      }

      // Generate template data
      const template: TemplateMetadata = {
        id: metadata.id || dir,
        name: metadata.name || dir.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type,
        premium: type === 'premium',
        category: metadata.category || 'General',
        description: metadata.description || `${type === 'premium' ? 'Premium' : 'Free'} template: ${dir}`,
        tags: metadata.tags || [type],
        features: metadata.features || ['Responsive Design'],
        previewImage: `/templates/${type === 'premium' ? 'premium' : 'free'}/${dir}/thumbnail.jpg`,
        previewUrl: `/templates/${type === 'premium' ? 'premium' : 'free'}/${dir}/index.html`,
        downloadUrl: `/api/download-template?id=${dir}&type=${type}`,
        ...metadata
      };

      // Ensure the template has all required fields
      if (!template.industry) {
        template.industry = ['General'];
      }
      if (!template.layout) {
        template.layout = 'standard';
      }
      if (template.responsive === undefined) {
        template.responsive = true;
      }
      if (template.graphics === undefined) {
        template.graphics = false;
      }

      templates.push(template as TemplateMetadata);
      console.log(`Processed ${type} template: ${template.name}`);
    } catch (error) {
      console.error(`Error processing template ${dir}:`, error);
    }
  }

  // Save to output file
  const outputPath = path.join(__dirname, outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2));
  console.log(`\nSuccessfully processed ${templates.length} ${type} templates.\nOutput saved to: ${outputPath}`);

  return templates;
}

// Main function to register all templates
async function registerAllTemplates() {
  try {
    const baseDir = path.join(__dirname, '..');
    
    // Process free templates
    const freeTemplatesDir = path.join(baseDir, 'templates', 'Free Templates');
    await processTemplates(freeTemplatesDir, 'free', 'free-templates.json');
    
    // Process premium templates
    const premiumTemplatesDir = path.join(baseDir, 'templates', 'Premium Templates');
    await processTemplates(premiumTemplatesDir, 'premium', 'premium-templates.json');
    
    console.log('\n✅ All templates have been registered successfully!');
  } catch (error) {
    console.error('❌ Error registering templates:', error);
    process.exit(1);
  }
}

// Run the registration
registerAllTemplates();
