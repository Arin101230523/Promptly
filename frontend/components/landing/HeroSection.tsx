import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MotionValue } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 100,
      damping: 12,
    },
  },
};

interface HeroSectionProps {
  heroY: MotionValue<number>;
}

const HeroSection = ({ heroY }: HeroSectionProps) => {
  const router = useRouter();
  return (
    <motion.section 
      style={{ y: heroY }}
      className="relative flex flex-col items-center justify-center min-h-screen pt-24 px-4 sm:px-6"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-5xl mx-auto"
      >
        {/* Hero Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">No Account Required</span>
        </motion.div>
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-black leading-none mb-5"
        >
          <span className="block">AI-Powered</span>
          <span className="block bg-gradient-to-r from-pink-400 via-orange-500 to-pink-500 bg-clip-text leading-tight text-transparent animate-gradient">
            Web Scraper
          </span>
        </motion.h1>
        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto"
        >
          Transform any website into a structured API with <strong>Promptly</strong>.
          <span className="text-orange-400 font-semibold"><br /> No coding required.</span>
        </motion.p>
        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-6 sm:px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-600 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all w-full sm:w-auto"
            onClick={() => router.push('/scraper')}
          >
            <span className="flex items-center space-x-2 justify-center">
              <span>Start Scraping For Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-8 py-4 border-2 border-white/20 rounded-2xl font-semibold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 transition-all w-full sm:w-auto cursor-pointer"
            onClick={() => router.push('/docs')}
          >
            See our Docs
          </motion.button>
        </motion.div>
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-gray-400"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Floating Elements (hidden on mobile) */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="hidden sm:absolute sm:top-1/4 sm:left-10 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl backdrop-blur-sm border border-white/10"
      />
      <motion.div
        animate={{ rotate: [360, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:absolute sm:top-1/3 sm:right-16 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400/30 to-orange-500/30 rounded-full backdrop-blur-sm border border-white/10"
      />
    </motion.section>
  );
};

export default HeroSection;
