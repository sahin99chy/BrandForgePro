import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieNotice } from "@/components/cookie-notice";
import Home from "@/pages/home";
import About from "@/pages/about";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";
import DescribeIdea from "@/pages/describe-idea";
import GeneratedBrand from "@/pages/generated-brand";
import Templates from "@/pages/templates";
import Testimonials from "@/pages/testimonials";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Account from "@/pages/account";

function Router() {
  const base = '/BrandForgePro';
  
  return (
    <Switch base={base}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/describe-idea" component={DescribeIdea} />
      <Route path="/generated-brand" component={GeneratedBrand} />
      <Route path="/templates" component={Templates} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/account" component={Account} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieNotice />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
