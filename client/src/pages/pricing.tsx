import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: Zap,
      color: "from-slate-600 to-slate-700",
      features: [
        "5 generations per month",
        "Basic templates",
        "JSON export",
        "Community support"
      ],
      limitations: [
        "No HTML export",
        "No custom templates",
        "Limited analytics"
      ]
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For serious entrepreneurs",
      icon: Crown,
      color: "from-blue-600 to-purple-600",
      popular: true,
      features: [
        "Unlimited generations",
        "All premium templates",
        "HTML & JSON export",
        "Advanced analytics",
        "Priority support",
        "Custom brand colors",
        "A/B testing insights"
      ],
      limitations: []
    },
    {
      name: "Agency",
      price: "$49",
      period: "per month",
      description: "For teams and agencies",
      icon: Rocket,
      color: "from-purple-600 to-pink-600",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "White-label exports",
        "API access",
        "Custom templates",
        "Dedicated support",
        "Usage analytics"
      ],
      limitations: []
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Plan
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Start free and upgrade as you grow. All plans include our core AI-powered landing page generation.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full relative overflow-hidden ${
                  plan.popular 
                    ? 'ring-2 ring-blue-500 shadow-2xl scale-105' 
                    : 'shadow-xl hover:shadow-2xl'
                } bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105`}>
                  <CardContent className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 ml-2">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link href="/">
                      <Button 
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {plan.name === 'Free' ? 'Get Started Free' : `Choose ${plan.name}`}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                  Why Choose BrandForge Pro?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Free Plan Limitations
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-slate-600 dark:text-slate-300">• Limited to 5 generations monthly</li>
                      <li className="text-slate-600 dark:text-slate-300">• Basic templates only</li>
                      <li className="text-slate-600 dark:text-slate-300">• No HTML export functionality</li>
                      <li className="text-slate-600 dark:text-slate-300">• Basic community support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Pro Plan Benefits
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-slate-600 dark:text-slate-300">• Unlimited generations</li>
                      <li className="text-slate-600 dark:text-slate-300">• Industry-specific templates</li>
                      <li className="text-slate-600 dark:text-slate-300">• Full HTML export with styling</li>
                      <li className="text-slate-600 dark:text-slate-300">• Priority email support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Can I upgrade or downgrade anytime?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Do you offer refunds?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}