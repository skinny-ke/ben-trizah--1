import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shared';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-4"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="bg-white p-6 rounded-full shadow-xl shadow-rose-100"
          >
            <Heart size={48} className="text-rose-400 fill-rose-400" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-4 tracking-tight">
          Welcome to Our <br />
          <span className="text-rose-400">Little World</span> 💖
        </h1>
        
        <p className="text-stone-500 text-lg md:text-xl mb-12 max-w-md mx-auto">
          Ben & Trizah — Our memories, forever. <br />
          A safe place for every laugh, every mile, and every heartbeat.
        </p>

        <Link to="/login">
          <Button size="lg" className="rounded-full px-10 py-4 text-xl shadow-lg shadow-rose-200 group">
            Enter Vault
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-2 inline-block"
            >
              →
            </motion.span>
          </Button>
        </Link>
      </motion.div>
      
      <div className="absolute bottom-12 text-stone-400 text-sm italic">
        "Grow old along with me! The best is yet to be."
      </div>
    </div>
  );
}