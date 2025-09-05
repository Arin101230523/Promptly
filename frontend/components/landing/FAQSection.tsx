import React from 'react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate is the AI-powered extraction?",
      answer: "Our AI achieves 99%+ accuracy across most websites by understanding context, structure, and content semantics. It continuously learns and improves from each extraction."
    },
    {
      question: "Do you handle dynamic content and JavaScript?",
      answer: "Yes! Our system fully renders JavaScript and handles dynamic content, AJAX requests, and single-page applications just like a real browser."
    },
    {
      question: "How do you handle website defenses and anti-bot measures?",
      answer: "Our platform uses stealth browser technology, dynamic user agents, and real-time evasion strategies to bypass anti-bot protections and ensure uninterrupted data extraction."
    },
    {
      question: "What types of data can Promptly extract?",
      answer: "Promptly can extract tables, lists, product details, prices, reviews, contact info, and more from any public web page. You can customize your extraction goal for structured results tailored to your needs."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. All data is encrypted in transit (HTTPS and SSL) and we follow best practices for privacy and security. We never store your extracted data longer than necessary for processing."
    }
  ];
  return (
    <motion.section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
        </motion.div>
        <div className="space-y-6 sm:space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-blue-700/20 shadow-lg backdrop-blur-xl hover:from-white/10 hover:to-white/20 transition-all"
            >
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                {faq.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
