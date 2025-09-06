'use client';

import React, { useEffect, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import DetailedFeaturesSection from '../components/landing/DetailedFeaturesSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import BackgroundElements from '../components/landing/BackgroundElements';
import ProgressBarAndScrollButton from '../components/landing/ProgressBarAndScrollButton';
import { Globe, Brain, Zap, BarChart, Target, TrendingUp, Users, Database, Lock, ShieldCheck, Github } from 'lucide-react';


function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.8], [100, -100]);

  useEffect(() => {
    setMounted(true);
    // Scroll to anchor if hash is present
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        // Wait for DOM to be ready
        setTimeout(() => {
          const el = document.getElementById(hash.replace('#', ''));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
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
    { value: "256-bit SSL", label: "Encrypted Connection", icon: Lock },
    { value: "GDPR", label: "Privacy Compliance", icon: ShieldCheck },
    { value: "Open Source", label: "Transparent Codebase", icon: Github },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      <BackgroundElements backgroundY={backgroundY} />
      <Navigation />
      <HeroSection heroY={heroY} />
      <StatsSection stats={stats} featuresY={featuresY} />
      <UseCasesSection useCases={useCases} />
      <DetailedFeaturesSection />
      <FeaturesSection features={features} />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ProgressBarAndScrollButton scrollYProgress={scrollYProgress} />
    </div>
  );
}

export default Home;