import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");
    
    if (!hasAcceptedCookies) {
      // Show cookie notice after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };
  
  const handleDecline = () => {
    // Still hide the notice but don't set the localStorage item
    // In a real app, you might want to disable non-essential cookies
    setIsVisible(false);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                We value your privacy
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies. 
                <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                  Learn more
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                Decline
              </Button>
              
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Accept All Cookies
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
