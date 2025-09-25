import React from 'react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "How do you scrape websites with tons of links?",
      answer: "Promptly uses batch exploration and smart link scoring to efficiently navigate and extract data from sites with hundreds or thousands of links, always prioritizing the most relevant paths."
    },
    {
      question: "Can I specify the format of the extracted data?",
      answer: "Yes! You can request any output format (JSON, CSV, etc.) and our system will structure the results accordingly."
    },
    {
      question: "How does Promptly decide which links to follow?",
      answer: "We use semantic analysis and machine learning to score and prioritize links, ensuring the agent explores the most relevant pages for your goal."
    },
    {
      question: "Can results be sent to my email?",
      answer: "If you specify an email address in your goal, Promptly can deliver results directly to your inbox using secure agent workflows."
    },
    {
      question: "Is my extraction private?",
      answer: "Your data is never stored or shared. All tasks run securely and privately, and results are only available to you."
    },
    {
      question: "Can I update or delete a task after creation?",
      answer: "Yes, you can update the URL or goal, or delete a task at any time using the API endpoints provided."
    },
    {
      question: "How do I check the status of my extraction task?",
      answer: "Use the provided task ID to query the status endpoint and see progress, results, or any errors encountered."
    },
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
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
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
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
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
