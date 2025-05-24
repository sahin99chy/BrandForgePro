import { useState, useEffect } from "react";

export function useAnalytics() {
  const [pageViews, setPageViews] = useState(2847);

  useEffect(() => {
    // Get stored page views or use default
    const stored = localStorage.getItem("brandforge_pageviews");
    if (stored) {
      setPageViews(parseInt(stored));
    }

    // Increment page views on load
    const newViews = pageViews + Math.floor(Math.random() * 5) + 1;
    setPageViews(newViews);
    localStorage.setItem("brandforge_pageviews", newViews.toString());

    // Update periodically to simulate real-time activity
    const interval = setInterval(() => {
      setPageViews(prev => {
        const updated = prev + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem("brandforge_pageviews", updated.toString());
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { pageViews };
}
