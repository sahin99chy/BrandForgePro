import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, TechFlow",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      content: "BrandForge saved us weeks of work and thousands of dollars. Our startup's brand identity was created in minutes, and the results were impressive enough to show investors right away.",
      stars: 5,
      delay: 0.1
    },
    {
      name: "Michael Chen",
      role: "CEO, GreenStart",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      content: "As a non-designer, I was struggling to create a cohesive brand for my eco-friendly startup. BrandForge gave me a professional-looking brand page that perfectly captured our mission.",
      stars: 5,
      delay: 0.2
    },
    {
      name: "Olivia Martinez",
      role: "Marketing Director, Fintech Solutions",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      content: "The brand page BrandForge created for us became the foundation of our entire marketing strategy. The copy was compelling and the visual identity was spot-on.",
      stars: 4,
      delay: 0.3
    },
    {
      name: "David Wilson",
      role: "Founder, HealthTech Innovations",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      content: "I've tried other brand generators, but BrandForge is in a different league. The AI understands nuance and creates brand elements that feel custom-made, not generic.",
      stars: 5,
      delay: 0.4
    }
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Users Say</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of founders who have transformed their startup ideas into compelling brands
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.delay }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Join over 2,500+ founders who have used BrandForge to launch their startups
          </p>
        </motion.div>
      </div>
    </section>
  );
}
