import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
            
            <p className="text-slate-600 dark:text-slate-300">Last updated: May 27, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to BrandForge. These Terms of Service ("Terms") govern your access to and use of the BrandForge website and services. By accessing or using our service, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
            <p>
              Throughout these Terms:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li><strong>"Service"</strong> refers to the BrandForge website, applications, and brand page generation tools.</li>
              <li><strong>"User"</strong> refers to individuals who access or use our Service.</li>
              <li><strong>"Content"</strong> refers to text, graphics, images, music, software, audio, video, information or other materials.</li>
              <li><strong>"User Content"</strong> refers to Content that users submit, upload, or transmit to the Service.</li>
              <li><strong>"BrandForge Content"</strong> refers to Content that we create and make available on the Service.</li>
              <li><strong>"Generated Content"</strong> refers to Content that is created by our AI systems based on User Content.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To access certain features of the Service, you may be required to register for an account. You must provide accurate and complete information and keep your account information updated. You are responsible for safeguarding your password and for all activities that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Content</h2>
            <p>
              You retain all rights in the User Content you submit, but you grant BrandForge a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with the Service.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>You own or have the necessary rights to the User Content you submit.</li>
              <li>The User Content does not infringe upon the intellectual property rights of any third party.</li>
              <li>The User Content does not violate any applicable laws or regulations.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Generated Content</h2>
            <p>
              BrandForge provides AI-generated brand content based on your inputs. While we strive for quality and originality, we cannot guarantee that Generated Content:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Is entirely unique or free from similarities to existing content.</li>
              <li>Will be suitable for all business purposes.</li>
              <li>Will be free from errors or inaccuracies.</li>
            </ul>
            <p>
              You are responsible for reviewing and approving all Generated Content before using it commercially. We recommend conducting appropriate trademark and copyright searches before adopting any brand names or identities.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property Rights</h2>
            <p>
              The Service and its original content (excluding User Content), features, and functionality are owned by BrandForge and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              For Generated Content, once you have paid for the applicable subscription or service, you receive a worldwide, non-exclusive, perpetual license to use the Generated Content for your business purposes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Prohibited Uses</h2>
            <p>
              You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>In any way that violates any applicable law or regulation.</li>
              <li>To transmit any material that is defamatory, obscene, or offensive.</li>
              <li>To impersonate or attempt to impersonate BrandForge, a BrandForge employee, or another user.</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use of the Service.</li>
              <li>To attempt to gain unauthorized access to the Service or related systems.</li>
              <li>To use the Service to generate content that promotes illegal activities, hate speech, or harmful content.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach the Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              In no event shall BrandForge, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@brandforge.pro<br />
              Address: 123 Innovation Way, San Francisco, CA 94107
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
