import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Zap, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">BrandForge</span>
            </div>
          </Link>
          
          {/* Navigation & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Home
                </div>
              </Link>
              <Link href="/describe-idea">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Create Brand
                </div>
              </Link>
              <Link href="/templates">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Templates
                </div>
              </Link>
              <Link href="/pricing">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Pricing
                </div>
              </Link>
              <Link href="/testimonials">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Testimonials
                </div>
              </Link>
              <Link href="/about">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  About
                </div>
              </Link>
              <Link href="/contact">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  Contact
                </div>
              </Link>
              <Link href="/account">
                <div className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  My Account
                </div>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-300" />
                )}
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Home
              </div>
            </Link>
            <Link href="/describe-idea">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Create Brand
              </div>
            </Link>
            <Link href="/pricing">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Pricing
              </div>
            </Link>
            <Link href="/testimonials">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Testimonials
              </div>
            </Link>
            <Link href="/about">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                About
              </div>
            </Link>
            <Link href="/contact">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                Contact
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
