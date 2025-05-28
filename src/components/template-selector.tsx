import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, 
  ShoppingCart, 
  Briefcase, 
  Gamepad2, 
  Heart, 
  GraduationCap, 
  Utensils,
  Code,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  examples: string[];
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

const templates: Template[] = [
  {
    id: "saas",
    name: "SaaS & Software",
    description: "Perfect for software products, tools, and platforms",
    icon: Laptop,
    color: "from-blue-500 to-cyan-500",
    examples: ["Project management tool", "Analytics platform", "Design software"]
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Ideal for online stores and product launches",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-500",
    examples: ["Fashion brand", "Electronics store", "Handmade crafts"]
  },
  {
    id: "agency",
    name: "Agency & Services",
    description: "Great for service-based businesses and consultancies",
    icon: Briefcase,
    color: "from-purple-500 to-violet-500",
    examples: ["Marketing agency", "Design studio", "Consulting firm"]
  },
  {
    id: "app",
    name: "Mobile App",
    description: "Optimized for app launches and mobile products",
    icon: Gamepad2,
    color: "from-pink-500 to-rose-500",
    examples: ["Social app", "Productivity app", "Gaming app"]
  },
  {
    id: "health",
    name: "Health & Wellness",
    description: "Tailored for healthcare and wellness businesses",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    examples: ["Fitness app", "Mental health platform", "Nutrition service"]
  },
  {
    id: "education",
    name: "Education",
    description: "Perfect for courses, tutorials, and learning platforms",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
    examples: ["Online course", "Coding bootcamp", "Language learning"]
  },
  {
    id: "food",
    name: "Food & Restaurant",
    description: "Designed for restaurants, food delivery, and culinary businesses",
    icon: Utensils,
    color: "from-orange-500 to-yellow-500",
    examples: ["Restaurant chain", "Food delivery", "Recipe platform"]
  },
  {
    id: "tech",
    name: "Tech Startup",
    description: "For innovative tech companies and cutting-edge solutions",
    icon: Code,
    color: "from-gray-600 to-gray-800",
    examples: ["AI platform", "Blockchain service", "IoT solution"]
  },
  {
    id: "general",
    name: "General Business",
    description: "Versatile template for any type of business",
    icon: Sparkles,
    color: "from-slate-500 to-slate-700",
    examples: ["Startup idea", "New venture", "Business concept"]
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Choose Your Industry Template
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Select a template to get industry-specific copy that resonates with your target audience
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:scale-102'
              } bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700`}
              onClick={() => onTemplateSelect(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 ${
                    hoveredTemplate === template.id ? 'scale-110' : ''
                  }`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {template.name}
                  </h4>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {template.description}
                  </p>

                  {selectedTemplate === template.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                        Selected
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Show examples for selected template */}
      {selectedTemplate && selectedTemplate !== "general" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Perfect for ideas like:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {templates.find(t => t.id === selectedTemplate)?.examples.map((example, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}