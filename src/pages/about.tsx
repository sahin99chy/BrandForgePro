import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Users, Sparkles, TrendingUp, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BrandForge
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              We're on a mission to democratize great copywriting. Every entrepreneur deserves compelling, 
              conversion-focused landing page copy that tells their story and drives results.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    To empower entrepreneurs and creators with AI-powered tools that transform their ideas into 
                    compelling, professional copy that converts visitors into customers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    A world where every startup, regardless of budget or experience, has access to world-class 
                    copywriting that helps them succeed and grow their business.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* What We Do */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              What We Do
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              BrandForge uses advanced AI to analyze your startup idea and generate complete landing page copy 
              that's tailored to your audience, industry, and goals.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Generation",
                description: "Advanced language models create compelling, conversion-focused copy tailored to your specific industry and audience."
              },
              {
                icon: TrendingUp,
                title: "Conversion Optimized",
                description: "Every headline, feature, and call-to-action is crafted using proven copywriting principles that drive results."
              },
              {
                icon: Users,
                title: "Template Library",
                description: "Choose from specialized templates for SaaS, e-commerce, agencies, and more to get industry-specific copy."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl border-0">
              <CardContent className="p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Transform Your Ideas?
                </h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs who've already generated compelling copy for their startups.
                </p>
                <Link href="/">
                  <Button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl">
                    Start Generating Copy
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}