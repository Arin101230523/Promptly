'use client';
import React from 'react';
import { Shield, Lock, Eye, Users, Globe, Settings, Mail, RefreshCw } from 'lucide-react';

import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';


const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 text-white overflow-auto">
    <Navigation />
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="w-full max-w-3xl py-20 px-6 rounded-xl shadow-2xl bg-white/5 backdrop-blur-lg mt-12 mb-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto mb-6 text-blue-400" />
         <h1 className="text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Promptly is designed to respect your privacy. We do not require accounts, and we do not collect personal information. This page explains what minimal data we store and how we protect it.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Last updated: September 2025
          </div>
        </div>

        <div className="space-y-12">
          {/* What We Store */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 mr-3 text-blue-400" />
              <h2 className="text-3xl font-bold text-blue-300">What Data Do We Store?</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <p>We only store the information you provide when using the service, such as:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold">Task details:</span> The URL, goal, and status you submit</li>
                <li><span className="font-semibold">Results:</span> The output generated for your request</li>
                <li><span className="font-semibold">Metadata:</span> Basic info like timestamps and page processing stats</li>
              </ul>
              <p>No personal identifiers, account info, or tracking cookies are collected.</p>
            </div>
          </div>

          {/* Why We Store It */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 mr-3 text-purple-400" />
              <h2 className="text-3xl font-bold text-purple-300">Why Do We Store This Data?</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <ul className="list-disc list-inside space-y-2">
                <li>To process your requests and display results</li>
                <li>To improve service reliability and performance</li>
                <li>To troubleshoot issues and maintain platform integrity</li>
              </ul>
              <p>We do not use your data for advertising, profiling, or sharing with third parties.</p>
            </div>
          </div>

          {/* Data Protection */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 mr-3 text-green-400" />
              <h2 className="text-3xl font-bold text-green-300">How Is Your Data Protected?</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <p>We use modern security practices to keep your data safe, including:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Encryption in transit and at rest</li>
                <li>All communication with our database is protected by TLS/SSL</li>
                <li>All data exchanged between our backend and hosted AI model is secured using encrypted channels</li>
                <li>Strict access controls</li>
                <li>Regular security reviews</li>
              </ul>
              <p>We never sell or share your data.</p>
            </div>
          </div>

          {/* Third Party Services */}
          <div className="border-l-4 border-orange-500 pl-6">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 mr-3 text-orange-400" />
              <h2 className="text-3xl font-bold text-orange-300">Third-Party Services</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <p>We do not use third-party analytics, advertising, or payment processors. Any external services used are strictly for hosting and infrastructure, and do not access your data.</p>
            </div>
          </div>

          {/* Your Rights */}
          <div className="border-l-4 border-indigo-500 pl-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 mr-3 text-indigo-400" />
              <h2 className="text-3xl font-bold text-indigo-300">Your Rights</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <p>If you have questions or concerns about your data, please contact us. You may request deletion of your stored tasks and results at any time.</p>
            </div>
          </div>

          {/* Contact & Updates */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 mr-3 text-pink-400" />
              <h2 className="text-3xl font-bold text-pink-300">Contact & Updates</h2>
            </div>
            <div className="space-y-4 text-gray-200">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-pink-200 mb-3">Questions?</h3>
                <p className="mb-4">If you have any questions or requests about this privacy policy or your data, please contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:privacy@promptly.com" className="text-blue-300 hover:text-blue-400 underline transition-colors">privacy@promptly.com</a></p>
                  <p><strong>Response Time:</strong> We typically respond within 48 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
                <RefreshCw className="w-6 h-6 text-pink-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-pink-200">Policy Updates</h4>
                  <p className="text-sm">We may update this privacy policy from time to time. The latest version will always be available on this page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg text-center">
            <Shield className="w-5 h-5 inline mr-2" />
            Your privacy is our priority
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
);

export default Privacy;