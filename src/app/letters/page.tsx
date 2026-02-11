"use strict";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader, LoadingSpinner, EmptyState, Modal } from "@/components/ui/shared";
import { toast } from "sonner";
import { Mail, Lock, Unlock, X, Heart, Plus, Send } from "lucide-react";

interface Letter {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLetter, setNewLetter] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchLetters();
  }, []);

  async function fetchLetters() {
    try {
      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (error: any) {
      toast.error("Preparing your letters...");
      setLetters([
        { 
          id: '1', 
          title: "Open when you miss me", 
          content: "My dearest Trizah,

If you're reading this, it means I'm not right there by your side, but remember that I'm always with you in heart. Close your eyes and feel my hug. I'll be back soon to hold you for real.

Always yours,
Ben", 
          created_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          title: "Open when you're stressed", 
          content: "Take a deep breath, love. You are stronger than you know and more capable than you think. I believe in you, and I'm your biggest fan. Everything will be okay.

Love, Ben", 
          created_at: new Date().toISOString() 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addLetter(e: React.FormEvent) {
    e.preventDefault();
    if (!newLetter.title || !newLetter.content) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("letters")
        .insert([{ 
          ...newLetter, 
          user_id: userData.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      setLetters([data, ...letters]);
      setNewLetter({ title: "", content: "" });
      setIsAdding(false);
      toast.success("Letter sealed with a kiss! 💌");
    } catch (error: any) {
      toast.error("Failed to send letter");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <PageHeader 
        title="Open-When Letters" 
        subtitle="Digital envelopes filled with love for every emotion." 
      />

      <div className="flex justify-center mb-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-pink-500 text-white rounded-full font-bold shadow-lg shadow-pink-200 flex items-center gap-2 hover:bg-pink-600 transition-all"
        >
          <Plus className="w-5 h-5" /> Write a Letter
        </motion.button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : letters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedLetter(letter)}
              className="group cursor-pointer relative"
            >
              {/* Envelope Shadow Effect */}
              <div className="absolute inset-0 bg-pink-200/20 translate-y-4 rounded-[2.5rem] blur-xl group-hover:bg-pink-400/30 transition-all" />
              
              <div className="relative bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-pink-50 flex flex-col items-center text-center overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200" />
                
                <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-pink-500 group-hover:rotate-12 transition-all duration-500">
                  <Mail className="w-10 h-10 text-pink-500 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-playfair font-bold text-pink-900 mb-4 px-2">{letter.title}</h3>
                
                <div className="flex items-center gap-2 text-pink-300 font-bold text-[10px] uppercase tracking-[0.3em] mt-auto">
                  <Lock className="w-3 h-3" /> Seal of Love
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState message="No letters yet. Why not write one for a rainy day?" icon={Mail} />
      )}

      {/* Write Letter Modal */}
      <Modal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title="Write a Special Letter"
      >
        <form onSubmit={addLetter} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Letter Occasion</label>
            <input
              required
              value={newLetter.title}
              onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
              placeholder="e.g. Open when you feel lonely"
              className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Message from the Heart</label>
            <textarea
              required
              value={newLetter.content}
              onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
              placeholder="Pour your heart out here..."
              className="w-full p-6 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium h-64 resize-none leading-relaxed"
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-pink-600 transition-all shadow-xl shadow-pink-100"
          >
            Seal and Send <Send className="w-5 h-5" />
          </button>
        </form>
      </Modal>

      {/* View Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="absolute inset-0 bg-pink-950/60 backdrop-blur-md"
            />
            <motion.div
              layoutId={`letter-${selectedLetter.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl bg-[#fffdfa] rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
            >
              {/* Envelope Design Top */}
              <div className="h-24 bg-pink-50 flex items-center justify-center border-b border-pink-100 relative">
                <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-pulse" />
                <button 
                  onClick={() => setSelectedLetter(null)}
                  className="absolute top-6 right-8 p-3 bg-white/50 rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-6 h-6 text-pink-400" />
                </button>
              </div>

              <div className="p-12 md:p-16 overflow-y-auto flex-1 custom-scrollbar">
                <div className="text-center mb-12">
                  <span className="text-pink-300 font-bold uppercase tracking-[0.4em] text-[10px]">Special Delivery</span>
                  <h2 className="text-4xl font-playfair font-bold text-pink-900 mt-4 leading-tight">
                    {selectedLetter.title}
                  </h2>
                </div>
                
                <div className="prose prose-pink max-w-none">
                  <p className="text-pink-900/90 text-2xl font-playfair leading-[1.8] whitespace-pre-wrap italic">
                    {selectedLetter.content}
                  </p>
                </div>

                <div className="mt-20 pt-10 border-t border-pink-50 text-center">
                  <div className="font-playfair text-3xl text-pink-600 font-bold mb-2">Forever yours,</div>
                  <div className="font-playfair text-xl text-pink-400">Ben</div>
                </div>
              </div>
              
              <div className="h-12 bg-pink-50/50 flex items-center justify-center">
                <span className="text-[9px] text-pink-200 font-bold uppercase tracking-widest">
                  Sealed on {new Date(selectedLetter.created_at).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}