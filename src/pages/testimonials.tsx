import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Testimonials as TestimonialsSection } from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Success Stories
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                See how BrandForge has helped founders and startups create compelling brand identities in minutes
              </p>
            </motion.div>
          </div>
        </section>
        
        <TestimonialsSection />
        
        <section className="py-16 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Share Your Experience
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                We'd love to hear about your experience with BrandForge. Submit your testimonial and it might be featured on our site!
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => window.location.href = "/contact"}
              >
                Submit Your Testimonial
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
