import type { GeneratedContent } from "@shared/schema";

// Define the template types
export type TemplateType = 
  | "minimal-tech" 
  | "fun-youthful" 
  | "premium-corporate" 
  | "creative-bold" 
  | "eco-friendly"
  | "modern-sleek"
  | "vintage-classic";

// Interface for template configuration
export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  brandNamePrefixes: string[];
  brandNameSuffixes: string[];
  headlineFormats: string[];
  subheadlineFormats: string[];
  ctaFormats: string[];
  featureTitlePrefixes: string[];
  colorPalettes: string[][];
  emojiSets: string[];
  brandTones: string[];
  fontPairings: {
    heading: string;
    body: string;
  }[];
  layoutStyle: "centered" | "asymmetric" | "grid" | "minimal" | "layered" | "bold" | "classic";
  animationLevel: "none" | "subtle" | "moderate" | "playful";
}

// Define the templates
export const templates: Record<TemplateType, TemplateConfig> = {
  "minimal-tech": {
    id: "minimal-tech",
    name: "Minimal Tech",
    description: "Clean, modern design with a focus on technology and innovation",
    brandNamePrefixes: ["Nexus", "Vertex", "Quantum", "Cipher", "Echo", "Pulse", "Nova", "Byte", "Flux", "Logic"],
    brandNameSuffixes: ["AI", "Tech", "Labs", "Systems", "IO", "HQ", "Core", "Cloud", "Data", "X"],
    headlineFormats: [
      "{brandName}: {idea}",
      "Introducing {brandName}",
      "{brandName} - The Future of {category}",
      "Meet {brandName}: Redefining {category}",
      "{brandName}: Intelligent {category} Solutions"
    ],
    subheadlineFormats: [
      "Transforming the way you experience {category}",
      "Streamlining {category} with cutting-edge technology",
      "The smarter approach to {category}",
      "Where innovation meets {category}",
      "Next-generation {category} platform"
    ],
    ctaFormats: [
      "Explore Platform",
      "Get Started",
      "Try it Free",
      "See it in Action",
      "Join the Waitlist"
    ],
    featureTitlePrefixes: [
      "Intelligent",
      "Seamless",
      "Advanced",
      "Automated",
      "Real-time"
    ],
    colorPalettes: [
      ["#0F172A", "#1E293B", "#38BDF8"],
      ["#18181B", "#27272A", "#818CF8"],
      ["#1A1A2E", "#16213E", "#0F3460"],
      ["#111827", "#374151", "#10B981"],
      ["#0F172A", "#334155", "#F472B6"]
    ],
    emojiSets: ["⚙️📊🔧", "🚀💻⚡", "📱🔍📈", "🔐💾🌐", "🤖📡🔬"],
    brandTones: [
      "Professional & Innovative",
      "Precise & Technical",
      "Efficient & Reliable",
      "Cutting-edge & Focused",
      "Intelligent & Streamlined"
    ],
    fontPairings: [
      { heading: "Inter", body: "Roboto Mono" },
      { heading: "Space Grotesk", body: "IBM Plex Sans" },
      { heading: "Manrope", body: "Fira Code" }
    ],
    layoutStyle: "minimal",
    animationLevel: "subtle"
  },
  "fun-youthful": {
    id: "fun-youthful",
    name: "Fun & Youthful",
    description: "Playful, energetic design with vibrant colors and friendly tone",
    brandNamePrefixes: ["Boom", "Buzz", "Pop", "Zap", "Vibe", "Spark", "Blast", "Zoom", "Fizz", "Bounce"],
    brandNameSuffixes: ["Joy", "Blast", "Fun", "Vibes", "Squad", "Crew", "Gang", "Hub", "Zone", "Spot"],
    headlineFormats: [
      "{brandName}: {idea} Just Got Awesome!",
      "Say Hello to {brandName}!",
      "{brandName} - Making {category} Fun Again",
      "Get Ready for {brandName}!",
      "{brandName}: {category} That Doesn't Bore You"
    ],
    subheadlineFormats: [
      "The fun way to experience {category}",
      "{category} that actually makes you smile",
      "Who said {category} can't be exciting?",
      "Bringing joy to {category} every day",
      "Finally, {category} that's actually enjoyable"
    ],
    ctaFormats: [
      "Let's Go! 🚀",
      "Join the Fun",
      "Get Started",
      "Jump In!",
      "Try it Now"
    ],
    featureTitlePrefixes: [
      "Awesome",
      "Super",
      "Epic",
      "Fantastic",
      "Amazing"
    ],
    colorPalettes: [
      ["#FF6B6B", "#4ECDC4", "#FFE66D"],
      ["#FF9F1C", "#FFBF69", "#2EC4B6"],
      ["#E63946", "#F1FAEE", "#A8DADC"],
      ["#FFADAD", "#FFD6A5", "#CAFFBF"],
      ["#9B5DE5", "#F15BB5", "#FEE440"]
    ],
    emojiSets: ["🎉🔥✨", "😎🚀🌈", "💯🎮🍕", "🤩👍💫", "🎯🎪🎭"],
    brandTones: [
      "Playful & Energetic",
      "Friendly & Approachable",
      "Exciting & Vibrant",
      "Fun & Engaging",
      "Cheerful & Upbeat"
    ],
    fontPairings: [
      { heading: "Fredoka One", body: "Quicksand" },
      { heading: "Nunito", body: "Varela Round" },
      { heading: "Baloo 2", body: "Montserrat" }
    ],
    layoutStyle: "asymmetric",
    animationLevel: "playful"
  },
  "premium-corporate": {
    id: "premium-corporate",
    name: "Premium Corporate",
    description: "Sophisticated, professional design with a focus on trust and authority",
    brandNamePrefixes: ["Apex", "Elite", "Prime", "Vertex", "Summit", "Prestige", "Capital", "Monarch", "Sterling", "Paragon"],
    brandNameSuffixes: ["Group", "Partners", "Global", "Ventures", "Capital", "Solutions", "Associates", "Advisors", "Enterprises", "International"],
    headlineFormats: [
      "{brandName}: Redefining Excellence in {category}",
      "{brandName} - Setting the Standard in {category}",
      "Introducing {brandName}: Premium {category} Solutions",
      "{brandName}: Where Excellence Meets {category}",
      "The {brandName} Advantage: Superior {category}"
    ],
    subheadlineFormats: [
      "Delivering exceptional {category} solutions for discerning clients",
      "Elevating {category} to unprecedented standards",
      "The premier choice for {category} excellence",
      "Sophisticated {category} solutions for today's challenges",
      "Setting the benchmark in {category} performance"
    ],
    ctaFormats: [
      "Book a Consultation",
      "Request a Demo",
      "Contact Our Team",
      "Learn More",
      "Schedule a Meeting"
    ],
    featureTitlePrefixes: [
      "Premium",
      "Strategic",
      "Comprehensive",
      "Exclusive",
      "Exceptional"
    ],
    colorPalettes: [
      ["#1C1C1C", "#2D2D2D", "#D4AF37"],
      ["#0C1B33", "#1D3557", "#A8DADC"],
      ["#2C3639", "#3F4E4F", "#A27B5C"],
      ["#2B2D42", "#8D99AE", "#EDF2F4"],
      ["#353535", "#3C6E71", "#FFFFFF"]
    ],
    emojiSets: ["📈💼✅", "🏆🔍📊", "💎🤝🌟", "📱💰🔒", "🌐📑⚖️"],
    brandTones: [
      "Professional & Authoritative",
      "Sophisticated & Refined",
      "Trustworthy & Established",
      "Premium & Exclusive",
      "Polished & Prestigious"
    ],
    fontPairings: [
      { heading: "Playfair Display", body: "Source Sans Pro" },
      { heading: "Cormorant Garamond", body: "Raleway" },
      { heading: "Libre Baskerville", body: "Work Sans" }
    ],
    layoutStyle: "classic",
    animationLevel: "none"
  },
  "creative-bold": {
    id: "creative-bold",
    name: "Creative & Bold",
    description: "Striking, artistic design with bold colors and innovative layouts",
    brandNamePrefixes: ["Vivid", "Prism", "Spark", "Neon", "Fusion", "Pixel", "Hue", "Canvas", "Mosaic", "Kaleidoscope"],
    brandNameSuffixes: ["Studio", "Design", "Creative", "Arts", "Media", "Works", "Collective", "Lab", "House", "Atelier"],
    headlineFormats: [
      "{brandName}: Boldly Reimagining {category}",
      "Break the Mold with {brandName}",
      "{brandName} - Where {category} Meets Imagination",
      "Dare to be Different with {brandName}",
      "{brandName}: Creativity Unleashed in {category}"
    ],
    subheadlineFormats: [
      "Pushing the boundaries of {category} with bold innovation",
      "Where creative thinking transforms {category}",
      "Reimagining what {category} can be",
      "Bringing artistic vision to {category}",
      "Boldly different {category} for forward thinkers"
    ],
    ctaFormats: [
      "Get Inspired",
      "Start Creating",
      "See Our Work",
      "Join the Movement",
      "Let's Create Together"
    ],
    featureTitlePrefixes: [
      "Bold",
      "Creative",
      "Innovative",
      "Striking",
      "Visionary"
    ],
    colorPalettes: [
      ["#FF595E", "#FFCA3A", "#8AC926"],
      ["#540D6E", "#EE4266", "#FFD23F"],
      ["#3A0CA3", "#4361EE", "#4CC9F0"],
      ["#F72585", "#7209B7", "#4CC9F0"],
      ["#FF9F1C", "#E71D36", "#2EC4B6"]
    ],
    emojiSets: ["🎨🔥💫", "✨🎭🌈", "🎯💡🎪", "🔮🧩🎪", "🌟🎪🎭"],
    brandTones: [
      "Bold & Artistic",
      "Creative & Expressive",
      "Innovative & Daring",
      "Imaginative & Vibrant",
      "Striking & Original"
    ],
    fontPairings: [
      { heading: "Bebas Neue", body: "Montserrat" },
      { heading: "Abril Fatface", body: "Poppins" },
      { heading: "Yeseva One", body: "Open Sans" }
    ],
    layoutStyle: "bold",
    animationLevel: "moderate"
  },
  "eco-friendly": {
    id: "eco-friendly",
    name: "Eco-Friendly",
    description: "Sustainable, natural design with earthy tones and organic elements",
    brandNamePrefixes: ["Terra", "Eco", "Green", "Leaf", "Nature", "Earth", "Sprout", "Bloom", "Gaia", "Verdant"],
    brandNameSuffixes: ["Life", "Earth", "Organic", "Eco", "Nature", "Green", "Sustainable", "Living", "Natural", "Harmony"],
    headlineFormats: [
      "{brandName}: Sustainable {category} for a Better Tomorrow",
      "{brandName} - Naturally Better {category}",
      "Introducing {brandName}: Eco-Conscious {category}",
      "{brandName}: Where {category} Meets Sustainability",
      "The Natural Choice: {brandName}"
    ],
    subheadlineFormats: [
      "Eco-friendly {category} solutions for a sustainable future",
      "Bringing natural goodness to {category}",
      "Sustainable {category} that respects our planet",
      "Environmentally conscious {category} for mindful living",
      "Nurturing our planet through better {category}"
    ],
    ctaFormats: [
      "Join the Movement",
      "Go Green With Us",
      "Make a Difference",
      "Learn More",
      "Start Your Journey"
    ],
    featureTitlePrefixes: [
      "Sustainable",
      "Eco-friendly",
      "Natural",
      "Organic",
      "Renewable"
    ],
    colorPalettes: [
      ["#588157", "#A3B18A", "#DAD7CD"],
      ["#344E41", "#3A5A40", "#A3B18A"],
      ["#386641", "#6A994E", "#F2E8CF"],
      ["#283618", "#606C38", "#FEFAE0"],
      ["#2D6A4F", "#40916C", "#D8F3DC"]
    ],
    emojiSets: ["🌱🌿🍃", "♻️🌎🌞", "🌳🦋🌻", "🌊🌄🍂", "🏞️🌾🌼"],
    brandTones: [
      "Natural & Sustainable",
      "Eco-conscious & Mindful",
      "Organic & Wholesome",
      "Earthy & Authentic",
      "Green & Harmonious"
    ],
    fontPairings: [
      { heading: "Bitter", body: "Source Sans Pro" },
      { heading: "Merriweather", body: "Lato" },
      { heading: "Aleo", body: "Nunito Sans" }
    ],
    layoutStyle: "asymmetric",
    animationLevel: "subtle"
  },
  "modern-sleek": {
    id: "modern-sleek",
    name: "Modern & Sleek",
    description: "Minimalist, contemporary design with clean lines and sophisticated aesthetics",
    brandNamePrefixes: ["Mono", "Slate", "Pure", "Zen", "Aria", "Luma", "Noir", "Mist", "Aura", "Eon"],
    brandNameSuffixes: ["Design", "Studio", "Space", "Form", "Concept", "Element", "Object", "Method", "System", "Theory"],
    headlineFormats: [
      "{brandName}: Refined {category} for Modern Needs",
      "Introducing {brandName}: Elegantly Simple {category}",
      "{brandName} - Where Simplicity Meets {category}",
      "The New Standard in {category}: {brandName}",
      "{brandName}: Thoughtfully Designed {category}"
    ],
    subheadlineFormats: [
      "Streamlined {category} solutions for the modern world",
      "Simplifying {category} through thoughtful design",
      "Elevating {category} with minimalist principles",
      "Clean, intuitive {category} for discerning users",
      "Where form and function unite in {category}"
    ],
    ctaFormats: [
      "Discover More",
      "Experience It",
      "Learn More",
      "Get Started",
      "See the Difference"
    ],
    featureTitlePrefixes: [
      "Intuitive",
      "Streamlined",
      "Elegant",
      "Refined",
      "Essential"
    ],
    colorPalettes: [
      ["#F8F9FA", "#E9ECEF", "#212529"],
      ["#FFFFFF", "#F8F9FA", "#343A40"],
      ["#DEE2E6", "#ADB5BD", "#212529"],
      ["#E0E0E0", "#F5F5F5", "#0D0D0D"],
      ["#EEEEEE", "#BDBDBD", "#424242"]
    ],
    emojiSets: ["◽️◾️▪️", "⚪⚫🔘", "🔳🔲⬜", "⬛◻️◼️", "🔵⚪⚫"],
    brandTones: [
      "Minimal & Refined",
      "Elegant & Understated",
      "Clean & Contemporary",
      "Sophisticated & Sleek",
      "Modern & Streamlined"
    ],
    fontPairings: [
      { heading: "Montserrat", body: "Roboto" },
      { heading: "DM Sans", body: "Inter" },
      { heading: "Poppins", body: "Work Sans" }
    ],
    layoutStyle: "minimal",
    animationLevel: "subtle"
  },
  "vintage-classic": {
    id: "vintage-classic",
    name: "Vintage & Classic",
    description: "Timeless, nostalgic design with retro elements and traditional aesthetics",
    brandNamePrefixes: ["Heritage", "Legacy", "Vintage", "Classic", "Retro", "Timeless", "Olde", "Antique", "Traditional", "Historic"],
    brandNameSuffixes: ["& Co.", "Brothers", "Emporium", "Goods", "Trading", "Craftsmen", "Mercantile", "Foundry", "Provisions", "Supply"],
    headlineFormats: [
      "{brandName}: Timeless {category} Since 2025",
      "Introducing {brandName}: Traditional {category} for Modern Times",
      "{brandName} - Crafting Quality {category}",
      "The Art of {category}: {brandName}",
      "{brandName}: Classic {category} Reimagined"
    ],
    subheadlineFormats: [
      "Honoring tradition in {category} with timeless quality",
      "Where heritage meets modern {category}",
      "Craftsmanship and attention to detail in every aspect of {category}",
      "Timeless {category} inspired by the past, built for the future",
      "Classic {category} values for the modern connoisseur"
    ],
    ctaFormats: [
      "Discover Our Heritage",
      "Explore Collection",
      "Learn Our Story",
      "Shop Now",
      "Visit Us"
    ],
    featureTitlePrefixes: [
      "Handcrafted",
      "Traditional",
      "Authentic",
      "Time-tested",
      "Artisanal"
    ],
    colorPalettes: [
      ["#774936", "#D7C0AE", "#EAE0D5"],
      ["#582F0E", "#7F4F24", "#E6CCB2"],
      ["#3F4E4F", "#A27B5C", "#DCD7C9"],
      ["#2C3639", "#3F4E4F", "#A27B5C"],
      ["#4A4E69", "#9A8C98", "#F2E9E4"]
    ],
    emojiSets: ["🕰️📜🧵", "🪑🏺📚", "⏳🧶🔖", "🗝️📯🏛️", "🧱⚱️🪶"],
    brandTones: [
      "Traditional & Timeless",
      "Classic & Refined",
      "Authentic & Nostalgic",
      "Heritage & Craftsmanship",
      "Vintage & Artisanal"
    ],
    fontPairings: [
      { heading: "Playfair Display", body: "Lora" },
      { heading: "Libre Baskerville", body: "EB Garamond" },
      { heading: "Crimson Text", body: "Spectral" }
    ],
    layoutStyle: "classic",
    animationLevel: "none"
  }
};

// Helper functions for generating random content
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random brand name based on template
export function generateBrandName(template: TemplateConfig): string {
  const prefix = getRandomItem(template.brandNamePrefixes);
  const suffix = getRandomItem(template.brandNameSuffixes);
  return `${prefix}${suffix}`;
}

// Function to generate a headline based on template, brand name, and idea
export function generateHeadline(template: TemplateConfig, brandName: string, idea: string, category: string): string {
  const format = getRandomItem(template.headlineFormats);
  const shortIdea = idea.length > 30 ? idea.substring(0, 30) + "..." : idea;
  
  return format
    .replace("{brandName}", brandName)
    .replace("{idea}", shortIdea)
    .replace("{category}", category);
}

// Function to generate a subheadline based on template and category
export function generateSubheadline(template: TemplateConfig, category: string): string {
  const format = getRandomItem(template.subheadlineFormats);
  return format.replace("{category}", category);
}

// Function to generate feature titles and descriptions
export function generateFeatures(template: TemplateConfig, category: string): Array<{title: string, description: string}> {
  const features = [];
  const usedPrefixes = new Set<string>();
  
  // Generic feature descriptions that can be used across templates
  const featureDescriptions = [
    `Our ${category} solution streamlines your workflow with intuitive design and powerful functionality.`,
    `Gain valuable insights with comprehensive analytics tailored for ${category}.`,
    `Seamlessly integrate with your existing ${category} tools and platforms.`,
    `Customizable ${category} solutions that adapt to your unique needs.`,
    `Save time and resources with our efficient ${category} management system.`,
    `Enhanced security features protect your ${category} data at every level.`,
    `Real-time updates keep you informed about your ${category} performance.`,
    `Collaborative tools make ${category} teamwork smooth and productive.`,
    `Mobile-friendly design lets you manage ${category} from anywhere.`,
    `Scalable architecture grows with your ${category} needs.`
  ];
  
  // Generate 3-4 unique features
  const featureCount = getRandomInt(3, 4);
  
  for (let i = 0; i < featureCount; i++) {
    // Get a prefix we haven't used yet
    let prefix = getRandomItem(template.featureTitlePrefixes);
    let attempts = 0;
    
    while (usedPrefixes.has(prefix) && attempts < 10) {
      prefix = getRandomItem(template.featureTitlePrefixes);
      attempts++;
    }
    
    usedPrefixes.add(prefix);
    
    // Generate a title with the prefix
    const titleSuffixes = [
      "Design", "Integration", "Analytics", "Management", 
      "Security", "Automation", "Experience", "Collaboration", 
      "Performance", "Solution"
    ];
    
    const title = `${prefix} ${getRandomItem(titleSuffixes)}`;
    const description = getRandomItem(featureDescriptions);
    
    features.push({
      title,
      description
    });
  }
  
  return features;
}

// Function to select a template based on category and randomness
export function selectTemplate(category: string): TemplateConfig {
  // Map categories to likely template types with some randomness
  const templateMapping: Record<string, TemplateType[]> = {
    "saas": ["minimal-tech", "modern-sleek", "premium-corporate"],
    "ecommerce": ["fun-youthful", "modern-sleek", "premium-corporate"],
    "agency": ["creative-bold", "premium-corporate", "modern-sleek"],
    "app": ["minimal-tech", "fun-youthful", "modern-sleek"],
    "health": ["eco-friendly", "modern-sleek", "premium-corporate"],
    "education": ["fun-youthful", "eco-friendly", "modern-sleek"],
    "food": ["eco-friendly", "vintage-classic", "fun-youthful"],
    "tech": ["minimal-tech", "modern-sleek", "creative-bold"],
    "general": Object.keys(templates) as TemplateType[]
  };
  
  // Get the appropriate template options for the category
  const templateOptions = templateMapping[category] || templateMapping["general"];
  
  // Select a random template from the options
  const templateType = getRandomItem(templateOptions);
  
  return templates[templateType];
}

// Main function to generate brand content with a specific template
export function generateTemplatedContent(idea: string, templateType: string, templateId?: TemplateType): GeneratedContent {
  // Select a template based on the category or use the specified template
  const template = templateId ? templates[templateId] : selectTemplate(templateType);
  
  // Generate a brand name
  const brandName = generateBrandName(template);
  
  // Generate headline and subheadline
  const headline = generateHeadline(template, brandName, idea, templateType);
  const subheadline = generateSubheadline(template, templateType);
  
  // Generate features
  const features = generateFeatures(template, templateType);
  
  // Select color palette, emoji style, and brand tone
  const colorPalette = getRandomItem(template.colorPalettes);
  const emojiStyle = getRandomItem(template.emojiSets);
  const brandTone = getRandomItem(template.brandTones);
  
  // Select CTA
  const cta = getRandomItem(template.ctaFormats);
  
  // Return the generated content with template information
  return {
    headline,
    subheadline,
    features,
    cta,
    colorPalette,
    emojiStyle,
    brandTone,
    templateId: template.id,
    templateName: template.name,
    layoutStyle: template.layoutStyle,
    animationLevel: template.animationLevel,
    fontPairing: getRandomItem(template.fontPairings)
  };
}
