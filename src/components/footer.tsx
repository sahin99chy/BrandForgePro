import { Zap, Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-3 mb-4 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">BrandForge</span>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Transform your startup ideas into compelling brand pages with the power of AI. BrandForge helps founders and entrepreneurs create professional brand identities in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/describe-idea">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Create Brand</div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Pricing</div>
                </Link>
              </li>
              <li>
                <Link href="/testimonials">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Testimonials</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Contact</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            &copy; {new Date().getFullYear()} BrandForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
