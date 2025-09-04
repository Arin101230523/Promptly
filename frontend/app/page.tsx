'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Zap, Brain, ChevronDown, Users, TrendingUp, Database, Target, BarChart, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Home() {
  const [mounted, setMounted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const router = useRouter();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "Effortless Data Extraction",
      description: "No more manual scraping. Define your goal, and let AI handle the complexity of extracting exactly what you need.",
      icon: Globe,
      gradient: "from-blue-400 to-cyan-500",
      delay: 0.1,
    },
    {
      title: "AI-Powered Insights", 
      description: "Beyond raw data, our system uses advanced AI to process and structure results according to your specific requirements.",
      icon: Brain,
      gradient: "from-purple-400 to-pink-500",
      delay: 0.2,
    },
    {
      title: "API on Demand",
      description: "Receive a unique API endpoint for each task, allowing seamless integration into your applications.",
      icon: Zap,
      gradient: "from-orange-400 to-red-500",
      delay: 0.3,
    },
  ];

  const useCases = [
    { title: "E-commerce Price Monitoring", desc: "Track competitor pricing across multiple platforms", icon: BarChart, color: "text-cyber-blue" },
    { title: "Lead Generation", desc: "Extract contact information from business directories", icon: Target, color: "text-cyber-green" },
    { title: "Market Research", desc: "Analyze social media sentiment and trends", icon: TrendingUp, color: "text-cyber-purple" },
    { title: "Job Aggregation", desc: "Collect job postings from multiple job boards", icon: Users, color: "text-cyber-pink" },
    { title: "Real Estate Data", desc: "Monitor property listings and market trends", icon: Database, color: "text-cyber-blue" },
    { title: "News Monitoring", desc: "Track news mentions and media coverage", icon: Globe, color: "text-cyber-green" }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime", icon: TrendingUp },
    { value: "Enterprise", label: "Grade Security", icon: Zap },
  ];

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

  if (!mounted) return null;

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </motion.div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Promptly
          </motion.div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Stats</a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              onClick={() => router.push('/scraper')}
            >
              Get Started
            </motion.button>
          </div>
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center relative">
            <button
              aria-label="Open menu"
              className="focus:outline-none"
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
                className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 rounded-xl shadow-lg border border-white/10 flex flex-col z-50"
              >
                <a
                  href="#features"
                  className="px-6 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 rounded-t-xl transition-colors text-base font-semibold"
                  onClick={() => { setNavOpen(false); }}
                >Features</a>
                <a
                  href="#stats"
                  className="px-6 py-3 text-gray-300 hover:text-white hover:bg-blue-500/10 transition-colors text-base font-semibold"
                  onClick={() => setNavOpen(false)}
                >Stats</a>
                <button
                  className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all text-base"
                  onClick={() => router.push('/scraper')}
                >Get Started</button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
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
            <span className="text-sm font-medium">Live & Ready to Scale</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-black leading-none mb-8"
          >
            <span className="block">AI-Powered</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Web Scraper
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Transform any website into a structured API with intelligent AI processing. 
            <span className="text-blue-400 font-semibold"> No coding required.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all w-full sm:w-auto"
              onClick={() => router.push('/scraper')}
            >
              <span className="flex items-center space-x-2 justify-center">
                <span>Start Scraping Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-4 border-2 border-white/20 rounded-2xl font-semibold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-[25px] left-1/2 transform -translate-x-1/2"
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

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl backdrop-blur-sm border border-white/10"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-16 w-16 h-16 bg-gradient-to-br from-pink-400/30 to-orange-500/30 rounded-full backdrop-blur-sm border border-white/10"
        />
      </motion.section>

      {/* Stats Section */}
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
                    <stat.icon className="w-8 h-8 text-blue-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring" }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Use Cases Section */}
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
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Possibilities
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From e-commerce to research, our platform adapts to your unique data extraction needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {useCases.map((useCase, index) => {
              // Assign gradient and icon bg based on color
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

      {/* Detailed Features Section */}
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
            {[
              {
                title: "Smart Rate Limiting",
                description: "Intelligent request throttling that adapts to website behavior, ensuring reliable data extraction without getting blocked.",
                icon: "⏱️",
                gradient: "from-blue-400 to-cyan-500",
              },
              {
                title: "Real-time Monitoring",
                description: "Live dashboard showing scraping progress, success rates, and detailed analytics for all your extraction tasks.",
                icon: "📊",
                gradient: "from-green-400 to-emerald-500",
              },
              {
                title: "Data Validation",
                description: "Automatic quality checks and data validation to ensure accuracy and consistency in your extracted information.",
                icon: "✅",
                gradient: "from-purple-400 to-violet-500",
              },
              {
                title: "Custom Scheduling",
                description: "Set up automated scraping schedules with flexible timing options to keep your data fresh and up-to-date.",
                icon: "📅",
                gradient: "from-orange-400 to-red-500",
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
            ].map((feature, index) => (
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
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors text-sm">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
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

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-16 sm:py-24 px-4 sm:px-6 relative"
      >
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
              className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-semibold mb-6"
            >
              ✨ Powered by Advanced AI
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Promptly?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of web scraping with our intelligent platform that learns and adapts to any website structure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-white/20 transition-all duration-500 h-full">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
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

      {/* How It Works Section */}
  <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to transform any website into your personal API
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Enter URL", desc: "Simply paste the website URL you want to scrape", color: "from-blue-400 to-cyan-500" },
              { step: "02", title: "Define Goals", desc: "Tell our AI what data you need in plain English", color: "from-purple-400 to-pink-500" },
              { step: "03", title: "Get API", desc: "Receive your custom API endpoint instantly", color: "from-green-400 to-emerald-500" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative text-center group"
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg`}
                  >
                    {item.step}
                  </motion.div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-600 to-transparent" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
  <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative">
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
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
          {[
            {
              question: "How accurate is the AI-powered extraction?",
              answer: "Our AI achieves 99%+ accuracy across most websites by understanding context, structure, and content semantics. It continuously learns and improves from each extraction."
            },
            {
              question: "Do you handle dynamic content and JavaScript?",
              answer: "Yes! Our system fully renders JavaScript and handles dynamic content, AJAX requests, and single-page applications just like a real browser."
            },
            {
              question: "What about rate limiting and getting blocked?",
              answer: "We use advanced techniques including rotating proxies, intelligent request timing, and browser fingerprint randomization to avoid detection and blocks."
            },
            {
              question: "Can I extract data from password-protected sites?",
              answer: "Yes, you can provide authentication credentials or session tokens. We support various authentication methods including OAuth, API keys, and custom headers."
            },
            {
              question: "Is my data secure and private?",
              answer: "Absolutely. All data is encrypted in transit and at rest. We're SOC 2 compliant and never store your extracted data longer than necessary for processing."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-blue-700/20 shadow-lg backdrop-blur-xl hover:from-white/10 hover:to-white/20 transition-all"
            >
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                {faq.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-xl rounded-3xl border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-3xl" />
            
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
              Join thousands of developers who trust Promptly for their data extraction needs
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
                className="px-6 sm:px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-purple-500/30 transition-all w-full sm:w-auto"
              >
                Get Started for Free Today!
              </motion.button>
              <span className="text-gray-400 text-sm">No credit card required</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
  <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 md:mb-0"
            >
              Promptly
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-8"
            >
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
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

      {/* Animated Progress Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/25 z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180" />
      </motion.button>

    </div>
  );
}

export default Home;