import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: November 4, 2025</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to KLASS ART. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              website and use our AI-powered image generation services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="leading-relaxed mb-2">We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Identity Data:</strong> Name, username, or similar identifier</li>
              <li><strong>Contact Data:</strong> Email address and phone number</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
              <li><strong>Content Data:</strong> Images you upload, generate, or customize using our services</li>
              <li><strong>Payment Data:</strong> Payment card details and transaction information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-2">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our AI image generation services</li>
              <li>To process your subscription payments and manage your account</li>
              <li>To improve and personalize your experience</li>
              <li>To communicate with you about updates, promotions, and service changes</li>
              <li>To detect and prevent fraud or technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
            <p className="leading-relaxed">
              We have implemented appropriate security measures to prevent your personal data from being accidentally 
              lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, 
              agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Your Generated Images</h2>
            <p className="leading-relaxed">
              Images you generate using our services are stored securely. Free users may have watermarked images, 
              while premium subscribers receive unwatermarked, high-resolution images with full commercial rights 
              as specified in their subscription plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Third-Party Services</h2>
            <p className="leading-relaxed">
              We use third-party payment processors (Razorpay) to process subscription payments. These providers 
              have their own privacy policies and we encourage you to read them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and store certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Your Rights</h2>
            <p className="leading-relaxed mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request transfer of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Data Retention</h2>
            <p className="leading-relaxed">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected 
              it for, including for legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 text-indigo-600 font-medium">support@klassart.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
