"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Lock, ArrowRight, Stars, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-200/30 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl"
      >
        <div className="flex justify-center mb-10 relative">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-pink-200/50 relative z-20"
          >
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
          </motion.div>
          {/* Floating Icons */}
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute top-0 left-[-40px] text-pink-300"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            className="absolute bottom-0 right-[-40px] text-rose-300"
          >
            <Stars className="w-10 h-10" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold font-playfair mb-6 text-pink-900 tracking-tight">
            Our Little <span className="text-pink-500 italic">World</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-pink-700/60 mb-12 font-medium italic max-w-xl mx-auto leading-relaxed">
            Ben & Trizah — A digital sanctuary for every laugh, every tear, and every beautiful milestone we share.
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(244, 114, 182, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-pink-500 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-pink-200 flex items-center gap-3 transition-all"
            >
              Unlock Our Vault <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <div className="flex items-center gap-3 text-pink-300 font-bold uppercase tracking-[0.3em] text-[10px]">
            <Lock className="w-3 h-3" /> Encrypted with Love
          </div>
        </div>
      </motion.div>
      
      {/* Visual Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              y: -500,
              x: Math.sin(i) * 100
            }}
            transition={{ 
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 3
            }}
            className="absolute bottom-[-100px]"
            style={{ 
              left: `${15 + i * 15}%`,
            }}
          >
            <Heart className="w-6 h-6 text-pink-200 fill-pink-100/50" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-center"
      >
        <p className="text-pink-200 font-playfair italic text-sm">
          "Where forever begins today."
        </p>
      </motion.div>
    </div>
  );
}