import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LoadingState() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
        <motion.div
          className="inline-block mb-4"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-lg font-semibold text-slate-900 dark:text-white mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Crafting Your Brand Story
        </motion.h3>
        
        <motion.p 
          className="text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Our AI is analyzing your idea and generating compelling copy...
        </motion.p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
