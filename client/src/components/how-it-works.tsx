import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Share2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Lightbulb,
      title: "Describe your startup",
      description: "Tell us about your business idea, target audience, and what makes your startup unique.",
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: Sparkles,
      title: "Our platform generates your brand",
      description: "Our AI analyzes your input and creates a complete brand identity including name, tagline, and visual elements.",
      color: "from-purple-500 to-purple-600",
      delay: 0.2
    },
    {
      icon: Share2,
      title: "Customize, export, or share it",
      description: "Fine-tune your generated brand page, export it as a PDF, or share it directly with stakeholders.",
      color: "from-pink-500 to-pink-600",
      delay: 0.3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Transform your startup idea into a compelling brand in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-700/10 p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.delay }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-gradient-to-br opacity-10 rounded-full"
                style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              />
              
              <div className={`w-14 h-14 mb-6 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
              
              <div className="absolute bottom-6 right-6 text-4xl font-bold text-slate-100 dark:text-slate-700">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
