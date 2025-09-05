import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundElementsProps {
  backgroundY: any;
}

const BackgroundElements: React.FC<BackgroundElementsProps> = ({ backgroundY }) => (
  <motion.div
    className="fixed inset-0 pointer-events-none"
    style={{ y: backgroundY }}
  >
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
  </motion.div>
);

export default BackgroundElements;
