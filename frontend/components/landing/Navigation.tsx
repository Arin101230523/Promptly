'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navigation = () => {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent cursor-pointer"
          onClick={() => router.push('/')}
        >
          Promptly
        </motion.div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="/#faq" className="text-gray-300 hover:text-white transition-colors">FAQs</Link>
          <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            onClick={() => router.push('/scraper')}
          >
            Playground
          </motion.button>
        </div>
        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center relative">
          <button
            aria-label="Open menu"
            className="focus:outline-none cursor-pointer"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Menu className="w-7 h-7 text-white" />
            )}
          </button>
          {/* Mobile menu dropdown */}
          {navOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full right-0 mt-2 w-56 bg-slate-900/95 rounded-xl shadow-lg border border-white/10 flex flex-col z-50"
            >
              <Link
                href="/#features"
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-t-xl transition-colors text-base font-semibold"
                onClick={() => { setNavOpen(false); }}
              >Features</Link>
              <Link
                href="/#faq"
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-colors text-base font-semibold"
                onClick={() => setNavOpen(false)}
              >FAQs</Link>
              <Link
                href="/docs"
                className="px-6 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-colors text-base font-semibold"
                onClick={() => setNavOpen(false)}
              >Docs</Link>
              <button
                className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all text-base"
                onClick={() => { setNavOpen(false); router.push('/scraper'); }}
              >Playground</button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
