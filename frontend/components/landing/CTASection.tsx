import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const router = useRouter();

  return (
    <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative p-12 bg-gradient-to-br from-pink-500/10 to-orange-600/10 backdrop-blur-xl rounded-3xl border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-600/5 rounded-3xl pointer-events-none" />
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black mb-6"
        >
          Ready to{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Supercharge
          </span>{' '}
          Your Data?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto"
        >
          Join Promptly today to join us in our mission to empower everyone with seamless access to knowledge.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 sm:px-10 py-4 bg-gradient-to-r cursor-pointer from-pink-500 to-orange-600 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-orange-500/30 transition-all w-full sm:w-auto"
            onClick = {() => router.push('/scraper')}
          >
            Get Started for Free Today!
          </motion.button>
          <span className="text-gray-400 text-sm">No credit card required</span>
        </motion.div>
      </motion.div>
    </div>
  </motion.section>
);
}

export default CTASection;
