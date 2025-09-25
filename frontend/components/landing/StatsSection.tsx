import React from 'react';
import { motion, MotionValue } from 'framer-motion';

interface Stat {
  icon: React.ElementType;
  value: string | number;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  featuresY: MotionValue<number>;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, featuresY }) => (
  <motion.section
    id="stats"
    style={{ y: featuresY }}
    className="py-16 sm:py-20 px-4 sm:px-6 relative"
  >
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="text-center group"
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all">
                {React.createElement(stat.icon, { className: "w-8 h-8 text-pink-400 group-hover:text-orange-400 transition-colors" })}
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring" }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent mb-2"
            >
              {stat.value}
            </motion.div>
            <div className="text-gray-400 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

export default StatsSection;
