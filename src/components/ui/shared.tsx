"use strict";
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { X, Heart } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

export { Button, Input };

export const Card = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={cn(
      "bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 hover:shadow-xl hover:shadow-pink-100/50 transition-all",
      className
    )}
  >
    {children}
  </motion.div>
);

export const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12 text-center pt-8">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-block p-3 bg-pink-50 rounded-full mb-4"
    >
      <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-playfair font-bold text-pink-900 mb-2"
    >
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-pink-600/60 font-medium italic text-lg"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-20 gap-4">
    <motion.div
      animate={{ 
        rotate: 360,
        scale: [1, 1.2, 1]
      }}
      transition={{ 
        rotate: { repeat: Infinity, duration: 2, ease: "linear" },
        scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
      }}
      className="text-pink-500"
    >
      <Heart className="w-10 h-10 fill-pink-500" />
    </motion.div>
    <p className="text-pink-300 font-medium animate-pulse">Loading our magic...</p>
  </div>
);

export const EmptyState = ({ message, icon: Icon }: { message: string; icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20 px-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-pink-200"
  >
    <div className="flex justify-center mb-4 text-pink-200">
      {Icon ? <Icon className="w-12 h-12" /> : <Heart className="w-12 h-12" />}
    </div>
    <p className="text-pink-400 font-medium italic text-lg max-w-sm mx-auto">{message}</p>
  </motion.div>
);

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-pink-900/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-6 border-b border-pink-50 flex justify-between items-center bg-pink-50/30">
            <h2 className="text-2xl font-playfair font-bold text-pink-900">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-pink-400 hover:text-pink-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto flex-1">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);