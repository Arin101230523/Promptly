import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const DetailedFeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered Page Analysis",
      description: "Leverages advanced AI models to intelligently identify and extract relevant data from complex web pages.",
      icon: "🤖",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      title: "Automatic Anti-Bot Evasion",
      description: "Uses stealth browser techniques and rotating user agents to minimize detection and maximize successful scraping.",
      icon: "🕵️‍♂️",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Instant API Generation",
      description: "Every extraction task instantly creates a unique API endpoint for seamless integration with your apps.",
      icon: "⚡",
      gradient: "from-purple-400 to-violet-500",
    },
    {
      title: "Data Validation",
      description: "Automatic quality checks and data validation to ensure accuracy and consistency in your extracted information.",
      icon: "✅",
      gradient: "from-purple-400 to-violet-500",
    },
    {
      title: "Multi-format Export",
      description: "Export your data in JSON, CSV, XML, or any custom format that fits your workflow and integration needs.",
      icon: "📁",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      title: "Enterprise Security",
      description: "Bank-level encryption, secure API keys, and compliance with data protection regulations for peace of mind.",
      icon: "🔒",
      gradient: "from-indigo-400 to-blue-500",
    },
  ];
  return (
    <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-300 text-sm font-semibold mb-6"
          >
            🚀 Complete Feature Set
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Everything You{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Need
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From simple data extraction to complex AI processing, we&apos;ve got every aspect of web scraping covered.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm">
                  {feature.description}
                </p>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-6 right-6 text-purple-400"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default DetailedFeaturesSection;
