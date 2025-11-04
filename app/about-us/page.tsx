import React from 'react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">About KLASS ART</h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90">
            Revolutionizing creativity with AI-powered image generation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At KLASS ART, we believe that everyone should have access to professional-quality image generation 
              and customization tools. Our mission is to democratize creativity by providing powerful AI-driven 
              solutions that transform ideas into stunning visual content.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're a content creator, designer, business owner, or hobbyist, KLASS ART empowers you 
              to bring your vision to life with cutting-edge artificial intelligence.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 mr-4">
                  <img src="/assets/images/icon/pricing-icon01.svg" alt="Text to Image" className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Text to Image</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Transform your text descriptions into beautiful, high-quality images with our advanced AI algorithms. 
                Simply describe what you want, and watch it come to life.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 mr-4">
                  <img src="/assets/images/icon/pricing-icon02.svg" alt="Image to Image" className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Image to Image</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Upload your images and transform them with AI. Change styles, backgrounds, colors, and more with 
                just a few clicks. Perfect for product photography and creative projects.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 mr-4">
                  <img src="/assets/images/icon/pricing-icon01.svg" alt="Product Placement" className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Product Placement</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Showcase your products in stunning AI-generated environments. Perfect for e-commerce, marketing, 
                and social media content creation.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3 mr-4">
                  <img src="/assets/images/icon/pricing-icon02.svg" alt="High Resolution" className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">High-Resolution Output</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Export your creations in various resolutions up to 4K. Premium subscribers get unwatermarked images 
                with full commercial rights.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 sm:p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">Why Choose KLASS ART?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Easy</h3>
                <p className="text-gray-700">
                  Generate professional images in seconds with our intuitive interface
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality</h3>
                <p className="text-gray-700">
                  State-of-the-art AI technology for stunning, professional results
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable Plans</h3>
                <p className="text-gray-700">
                  Flexible pricing options from free to premium to suit your needs
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-700">
                  Your data and creations are protected with enterprise-grade security
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsive Design</h3>
                <p className="text-gray-700">
                  Access from any device - desktop, tablet, or mobile
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Support</h3>
                <p className="text-gray-700">
                  Dedicated customer support to help you every step of the way
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                KLASS ART was born from a simple observation: while AI image generation technology was advancing 
                rapidly, it remained largely inaccessible to everyday creators and businesses. We set out to change that.
              </p>
              <p>
                Our team of AI engineers, designers, and creative professionals worked tirelessly to build a platform 
                that combines cutting-edge technology with user-friendly design. The result is KLASS ART - a tool that 
                makes professional-quality image generation available to everyone.
              </p>
              <p>
                Today, thousands of creators, businesses, and individuals use KLASS ART to bring their creative visions 
                to life. From product photography to social media content, from marketing materials to personal projects, 
                KLASS ART is helping people create stunning visuals faster and easier than ever before.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-8 sm:p-12 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl mb-6 opacity-90">
              Join thousands of creators using KLASS ART to transform their ideas into reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscription">
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                  View Pricing
                </button>
              </Link>
              <Link href="/service/TextToImage">
                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition">
                  Try It Free
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-100 py-8 px-4 text-center">
        <p className="text-gray-600">
          Have questions? <Link href="#" className="text-indigo-600 hover:underline">Contact us</Link> - we'd love to hear from you!
        </p>
      </div>
    </div>
  );
}
