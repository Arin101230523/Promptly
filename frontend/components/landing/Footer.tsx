import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent mb-6 md:mb-0 cursor-pointer"
          onClick ={() => router.push('/')}
        >
          Promptly
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center space-x-8"
        >
          <a href={`${frontendUrl}/privacy`} className="text-gray-400 hover:text-white transition-colors" onClick={()=>(router.push('/privacy'))}>Privacy</a>
          <a href={`${frontendUrl}/terms`} className="text-gray-400 hover:text-white transition-colors" onClick={()=>(router.push('/terms'))}>Terms</a>
          <a href={`${frontendUrl}/contact`} className="text-gray-400 hover:text-white transition-colors" onClick={()=>(router.push('/contact'))}>Contact</a>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500"
      >
        © 2025 Promptly. All rights reserved. Built with passion for developers.
      </motion.div>
    </div>
  </footer>
);
}

export default Footer;
