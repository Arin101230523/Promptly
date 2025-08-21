"use client";

import Link from "next/link";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { scrollYProgress } = useViewportScroll();
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 200]); // scroll parallax

  const features = [
    {
      title: "Effortless Data Extraction",
      desc: "No more manual scraping. Define your goal, and let AI handle the complexity of extracting exactly what you need.",
      color: "from-blue-400 to-blue-600",
      icon: "🌐",
    },
    {
      title: "AI-Powered Insights",
      desc: "Beyond raw data, our system uses advanced AI to process and structure results according to your specific requirements.",
      color: "from-green-400 to-green-600",
      icon: "🤖",
    },
    {
      title: "API on Demand",
      desc: "Receive a unique API endpoint for each task, allowing seamless integration into your applications.",
      color: "from-purple-400 to-purple-600",
      icon: "⚡",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        
        {/* Animated floating blobs */}
        <motion.div
          className="absolute -top-60 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full blur-3xl opacity-40"
          style={{ y: blobY }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-blue-500 to-teal-400 rounded-full blur-3xl opacity-30"
          style={{ y: blobY }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          AI-Powered{" "}
          <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
            Web Scraper
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl text-gray-200 max-w-2xl mb-10"
        >
          Turn any website into a structured API with intelligent AI processing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/scraper">
            <Button className="px-10 py-6 text-lg rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 transition transform hover:scale-105 animate-pulse">
              🚀 Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Floating neon icons */}
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-50 animate-bounce-slow"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🌐
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-20 text-5xl opacity-40 animate-spin-slow"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ⚡
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Smarter, faster, and easier web scraping powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800/30 border border-gray-700 rounded-2xl backdrop-blur-lg shadow-xl transform hover:scale-105 hover:rotate-1 transition">
                <CardContent className="p-8 flex flex-col items-center">
                  <span className="text-5xl mb-4 animate-bounce">{feature.icon}</span>
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 text-center bg-black/80 border-t border-gray-800 relative overflow-hidden">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-gray-400 mb-6"
        >
          Ready to supercharge your data extraction?
        </motion.p>
        <Link href="/scraper">
          <Button className="px-8 py-5 text-lg rounded-2xl shadow-lg bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 transition transform hover:scale-105">
            Start Scraping Now →
          </Button>
        </Link>
        <p className="mt-10 text-gray-500 text-sm">© 2025 AI-Powered Web Scraper. All rights reserved.</p>

        {/* Floating neon particles */}
        <motion.div
          className="absolute top-10 left-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-70"
          animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-4 h-4 bg-pink-500 rounded-full opacity-60"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </footer>
    </div>
  );
}
