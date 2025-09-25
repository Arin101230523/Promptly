import { MessageCircle, MapPin, Headphones, Zap } from 'lucide-react';

import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import ContactFormEmailJS from './ContactFormEmailJS';


const Contact = () => {
  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 text-white">
    <Navigation />
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="w-full max-w-5xl py-10 px-3 sm:py-24 sm:px-8 rounded-xl shadow-2xl bg-white/5 backdrop-blur-lg mt-6 mb-6 sm:mt-12 sm:mb-12">
  <div className="text-center mb-8 sm:mb-12">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-orange-400" />
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
            Contact Us
          </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
              We&#39;d love to hear from you! Whether you have questions, feedback, or need support, our team is here to help you succeed with Promptly.
            </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 w-full">
          {/* Support Categories */}
          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-green-500 pl-3 sm:pl-6">
              <div className="flex items-center mb-2 sm:mb-4">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-400" />
                <h2 className="text-xl sm:text-3xl font-bold text-green-300">Support Categories</h2>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 mr-2 text-green-400" />
                    <h4 className="font-semibold text-green-200">Technical Support</h4>
                  </div>
                  <p className="text-sm text-gray-300">API issues, integration problems, platform bugs</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
                    <h4 className="font-semibold text-green-200">Feature Requests</h4>
                  </div>
                  <p className="text-sm text-gray-300">Suggestions, feedback, new feature ideas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4 sm:space-y-6">
            <div className="border-l-4 border-orange-500 pl-3 sm:pl-6">
              <div className="flex items-center mb-2 sm:mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-orange-400" />
                <h2 className="text-xl sm:text-3xl font-bold text-orange-300">Connect With Us</h2>
              </div>
              <div className="space-y-2 sm:space-y-3 text-gray-200 text-sm sm:text-base">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-orange-200 mb-2">Links</h4>
                  <div className="space-y-2">
                    <p>GitHub: <a href="https://github.com/Arin101230523/Promptly" className="text-green-300 underline hover:text-green-400 transition">github.com/Arin101230523/Promptly</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Form with EmailJS */}
        <ContactFormEmailJS />

        <div className="mt-8 sm:mt-16 flex justify-center">
          <div className="px-4 sm:px-8 py-2 sm:py-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-600 text-white font-bold shadow-lg text-center text-sm sm:text-base">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            Let&#39;s connect and build something amazing together!
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
  );
}

export default Contact;