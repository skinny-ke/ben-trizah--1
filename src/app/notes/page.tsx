"use strict";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader, Card, LoadingSpinner, EmptyState } from "@/components/ui/shared";
import { toast } from "sonner";
import { Plus, Trash2, StickyNote, Send, X, Sparkles, Wand2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const SUGGESTIONS = [
  "Trizah, thank you for choosing us every day 💖",
  "You're the best thing that ever happened to me, Ben.",
  "Your smile is my favorite view in the entire world.",
  "Just a quick reminder that I love you more than words can say.",
  "I'm so lucky to be building a life with you.",
  "Thinking of our last date and smiling. Can't wait for the next one!"
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast.error("Connecting to vault...");
      // Seed for fallback/demo
      setNotes([
        { id: '1', content: "Trizah, thank you for choosing us every day 💖", created_at: new Date().toISOString() },
        { id: '2', content: "You're the best thing that ever happened to me, Ben.", created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("notes")
        .insert([{ content: newNote, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setNotes([data, ...notes]);
      setNewNote("");
      setIsAdding(false);
      toast.success("Note added to our vault!");
    } catch (error: any) {
      toast.error("Failed to add note");
    }
  }

  async function deleteNote(id: string) {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      setNotes(notes.filter((n) => n.id !== id));
      toast.success("Note removed");
    } catch (error: any) {
      toast.error("Failed to delete note");
    }
  }

  const generateSuggestion = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
      setNewNote(random);
      setIsGenerating(false);
      toast.info("Magic suggestion added! ✨");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <PageHeader 
        title="Love Notes" 
        subtitle="Little whispers of our love, kept safe forever." 
      />

      <div className="flex justify-center mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className={`px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all ${
            isAdding 
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200" 
              : "bg-pink-500 text-white shadow-pink-200 hover:bg-pink-600"
          }`}
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? "Close Editor" : "Write a New Note"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="mb-12 overflow-hidden"
          >
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-pink-100 relative">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-pink-300 uppercase tracking-widest">Editor</span>
                <button
                  onClick={generateSuggestion}
                  disabled={isGenerating}
                  className="text-xs font-bold text-pink-500 flex items-center gap-1 hover:text-pink-600 transition-colors"
                >
                  <Wand2 className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  Need a suggestion?
                </button>
              </div>
              
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write something sweet for Trizah..."
                className="w-full h-40 p-6 bg-pink-50/30 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none resize-none font-medium text-lg italic text-pink-900 placeholder:text-pink-200"
              />
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="bg-pink-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-100 disabled:opacity-50"
                >
                  Send to Vault <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <LoadingSpinner />
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {notes.map((note, index) => (
            <Card key={note.id} delay={index * 0.05} className="flex flex-col justify-between group min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                    <StickyNote className="w-5 h-5 text-pink-400" />
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-200 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-pink-900 font-medium italic text-xl leading-relaxed">
                  "{note.content}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-pink-50" />
                <span className="text-[10px] text-pink-200 font-bold uppercase tracking-[0.2em]">
                  {new Date(note.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <div className="h-[1px] flex-1 bg-pink-50" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState message="The vault is quiet. Why not leave a sweet whisper?" icon={StickyNote} />
      )}
    </div>
  );
}