'use client';
import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, Users, Gavel, Clock, Mail, CheckCircle } from 'lucide-react';

import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';


const Terms = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 text-white">
    <Navigation />
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="w-full max-w-5xl py-10 px-3 sm:py-24 sm:px-8 rounded-xl shadow-2xl bg-white/5 backdrop-blur-lg mt-6 mb-6 sm:mt-12 sm:mb-12">
  <div className="text-center mb-8 sm:mb-12">
          <Scale className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-blue-400" />
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Terms of Service
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
            By using <span className="font-bold text-blue-300">Promptly</span>, you agree to these terms and conditions. Please read them carefully to understand your rights and responsibilities.
          </p>
          <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-400">
            Last updated: September 2025
          </div>
        </div>

  <div className="space-y-8 sm:space-y-12">
          {/* Acceptance of Terms */}
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-blue-300">Acceptance of Terms</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>By accessing and using Promptly, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                <p className="text-sm"><strong>Important:</strong> These terms constitute a legally binding agreement between you and Promptly. Your continued use of our service indicates your acceptance of any updates to these terms.</p>
              </div>
            </div>
          </div>

          {/* Use of Service */}
          <div className="border-l-4 border-purple-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-purple-300">Use of Service</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>You agree to use Promptly in compliance with all applicable laws and regulations. You are responsible for the data you submit and your conduct while using the service.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-200 mb-1 sm:mb-2">✅ Permitted Uses</h4>
                  <ul className="text-xs sm:text-sm space-y-1">
                    <li>• Creating tasks and submitting goals</li>
                    <li>• Viewing and using generated results</li>
                    <li>• Educational and informational purposes</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-red-200 mb-1 sm:mb-2">❌ Prohibited Uses</h4>
                  <ul className="text-xs sm:text-sm space-y-1">
                    <li>• Illegal or harmful activities</li>
                    <li>• Spam or unsolicited communications</li>
                    <li>• Reverse engineering our service</li>
                    <li>• Violating others&#39; intellectual property</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Responsibilities */}
          <div className="border-l-4 border-green-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-green-300">Data Responsibilities</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>Promptly does not require user accounts. You are responsible for ensuring that any data or URLs you submit do not violate laws or third-party rights.</p>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:space-x-3 bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0 sm:mt-1 mb-1 sm:mb-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-200">Lawful Use</h4>
                    <p className="text-xs sm:text-sm">Only submit data and URLs you have the right to use and that comply with all laws.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:space-x-3 bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0 sm:mt-1 mb-1 sm:mb-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-200">No Sensitive Data</h4>
                    <p className="text-xs sm:text-sm">Do not submit personal, confidential, or sensitive information.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="border-l-4 border-orange-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-orange-300">Intellectual Property</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>The service and its original content, features, and functionality are and will remain the exclusive property of Promptly and its licensors.</p>
              <div className="bg-white/5 rounded-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-orange-200 mb-2 sm:mb-3">Your Content</h4>
                    <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                      <li>• You retain ownership of content you create</li>
                      <li>• You grant us license to use your content to provide our service</li>
                      <li>• You&#39;re responsible for ensuring you have rights to content you upload</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-200 mb-2 sm:mb-3">Our Content</h4>
                    <ul className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                      <li>• Our platform, features, and branding are protected</li>
                      <li>• You may not copy, modify, or distribute our content</li>
                      <li>• Respect third-party intellectual property rights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="border-l-4 border-red-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-red-300">Limitation of Liability</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>Promptly is provided &quot;as is&quot; without warranties of any kind, either express or implied. We shall not be liable for any damages arising from your use of the service.</p>
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 sm:p-6 border border-red-500/30">
                <h4 className="font-semibold text-red-200 mb-2 sm:mb-3">Disclaimer</h4>
                <p className="text-xs sm:text-sm mb-2 sm:mb-3">To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our service and the use of this service.</p>
                <p className="text-xs sm:text-sm">We will not be liable for any consequential, incidental, indirect, or special damages arising out of or in connection with your use of our service.</p>
              </div>
            </div>
          </div>

          {/* Service Access */}
          <div className="border-l-4 border-indigo-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-indigo-300">Service Access</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <p>We reserve the right to restrict or discontinue access to Promptly at any time, for any reason, including misuse or violation of these terms.</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-l-4 border-pink-500 pl-3 sm:pl-6">
            <div className="flex items-center mb-2 sm:mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-pink-400" />
              <h2 className="text-xl sm:text-3xl font-bold text-pink-300">Questions & Contact</h2>
            </div>
            <div className="space-y-2 sm:space-y-4 text-gray-200 text-sm sm:text-base">
              <div className="bg-white/5 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-pink-200 mb-2 sm:mb-3">Need Help with These Terms?</h3>
                <p className="mb-2 sm:mb-4">If you have any questions about these Terms of Service, please don&#39;t hesitate to contact us:</p>
                <div className="space-y-1 sm:space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:legal@promptly.com" className="text-blue-300 hover:text-blue-400 underline transition-colors">legal@promptly.com</a></p>
                  <p><strong>Support:</strong> <a href="mailto:support@promptly.com" className="text-blue-300 hover:text-blue-400 underline transition-colors">support@promptly.com</a></p>
                  <p><strong>Response Time:</strong> We typically respond within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-16 flex justify-center">
          <div className="px-4 sm:px-8 py-2 sm:py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg text-center text-sm sm:text-base">
            <Gavel className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            Use Promptly responsibly and enjoy!
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
);

export default Terms;