import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-slate dark:prose-invert max-w-none"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <p className="text-slate-600 dark:text-slate-300">Last updated: May 27, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to BrandForge ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              <li><strong>Content Data</strong> includes the startup ideas and descriptions you provide to our service for brand page generation.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your requested services.</li>
              <li>To manage our relationship with you.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
              <li>To recommend products or services that may be of interest to you.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies</h2>
            <p>
              We use cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to the Privacy Policy</h2>
            <p>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <p>
              Email: privacy@brandforge.pro<br />
              Address: 123 Innovation Way, San Francisco, CA 94107
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
