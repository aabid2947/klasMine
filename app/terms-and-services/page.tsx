import React from 'react';

export default function TermsAndServices() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms & Services</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: November 4, 2025</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using KLASS ART's AI-powered image generation platform, you accept and agree to be 
              bound by the terms and provisions of this agreement. If you do not agree to these terms, please do 
              not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
            <p className="leading-relaxed mb-2">
              KLASS ART provides AI-powered image generation and customization services, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Text to Image:</strong> Generate images from text descriptions</li>
              <li><strong>Image to Image:</strong> Transform and customize existing images</li>
              <li><strong>Product Placement:</strong> Place products in AI-generated backgrounds</li>
              <li><strong>High-Resolution Exports:</strong> Download images in various resolutions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="leading-relaxed">
              To access certain features, you must register for an account. You are responsible for maintaining 
              the confidentiality of your account credentials and for all activities that occur under your account. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Subscription Plans</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Plan</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Limited AI image generations</li>
                  <li>Watermarked images</li>
                  <li>Basic resolution output</li>
                  <li>Limited text extraction</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Plans</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Unlimited AI image generations</li>
                  <li>High-resolution and 4K outputs</li>
                  <li>No watermarks</li>
                  <li>Full commercial rights</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Payment Terms</h2>
            <p className="leading-relaxed mb-2">
              Subscription fees are billed in advance on a monthly or annual basis. All payments are processed 
              securely through Razorpay. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete payment information</li>
              <li>Automatic renewal unless cancelled before the next billing cycle</li>
              <li>No refunds for partial months or unused services</li>
              <li>We reserve the right to change subscription fees with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. User Content and Conduct</h2>
            <p className="leading-relaxed mb-2">You agree not to use our services to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Generate content that is illegal, harmful, threatening, abusive, or offensive</li>
              <li>Violate any intellectual property rights</li>
              <li>Generate deepfakes or misleading content of real individuals</li>
              <li>Impersonate any person or entity</li>
              <li>Generate content that promotes violence, discrimination, or hate speech</li>
              <li>Use the service for any automated or bulk operations without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Intellectual Property Rights</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Generated Content</h3>
                <p className="leading-relaxed">
                  Free users: You retain ownership but images may include watermarks. Premium subscribers receive 
                  full commercial rights to generated images without watermarks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Our Platform</h3>
                <p className="leading-relaxed">
                  KLASS ART and all associated logos, designs, and technology remain our exclusive property. 
                  You may not copy, modify, or reverse engineer any part of our service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Content Moderation</h2>
            <p className="leading-relaxed">
              We reserve the right to review, monitor, and remove any content that violates these terms. We may 
              suspend or terminate accounts that repeatedly violate our policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Service Availability</h2>
            <p className="leading-relaxed">
              We strive to provide 99.9% uptime but do not guarantee uninterrupted service. We reserve the right 
              to modify or discontinue services with reasonable notice. We are not liable for any loss resulting 
              from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="leading-relaxed">
              KLASS ART shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages resulting from your use or inability to use the service. Our total liability shall not 
              exceed the amount you paid for the service in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Termination</h2>
            <p className="leading-relaxed">
              You may cancel your subscription at any time through your account settings. We may terminate or 
              suspend your account immediately for violations of these terms, without prior notice or liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or through the platform. Continued use after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Governing Law</h2>
            <p className="leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes 
              shall be resolved in the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms & Services, please contact us at:
            </p>
            <p className="mt-2 text-indigo-600 font-medium">support@klassart.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
