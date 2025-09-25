import React from 'react';
import { motion } from 'framer-motion';

interface UseCase {
  color: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}

const UseCasesSection: React.FC<{ useCases: UseCase[] }> = ({ useCases }) => (
  <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Endless{' '}
          <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
            Possibilities
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          From e-commerce to research, our platform adapts to your unique data extraction needs
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {useCases.map((useCase, index) => {
          let cardGradient = "from-blue-900/60 to-blue-700/40";
          let iconGradient = "from-blue-400 to-cyan-400";
          if (useCase.color === "text-cyber-green") {
            cardGradient = "from-green-900/60 to-green-700/40";
            iconGradient = "from-green-400 to-emerald-400";
          } else if (useCase.color === "text-cyber-purple") {
            cardGradient = "from-purple-900/60 to-purple-700/40";
            iconGradient = "from-purple-400 to-pink-400";
          } else if (useCase.color === "text-cyber-pink") {
            cardGradient = "from-pink-900/60 to-pink-700/40";
            iconGradient = "from-pink-400 to-purple-400";
          }
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className={`group relative p-8 rounded-3xl border border-white/10 shadow-lg bg-gradient-to-br ${cardGradient} hover:from-white/10 hover:to-white/20 transition-all duration-300 backdrop-blur-xl`}
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 bg-gradient-to-br ${iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <useCase.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{useCase.title}</h3>
              <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{useCase.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>
);

export default UseCasesSection;
