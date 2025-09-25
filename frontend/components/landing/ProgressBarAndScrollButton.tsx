import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { MotionValue } from 'framer-motion';

const ProgressBarAndScrollButton = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => (
  <>
    {/* Animated Progress Bar */}
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-600 transform origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
    {/* Floating Action Button */}
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/25 z-40"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180" />
    </motion.button>
  </>
);

export default ProgressBarAndScrollButton;
