"use strict";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader, LoadingSpinner, EmptyState, Card } from "@/components/ui/shared";
import { toast } from "sonner";
import { Music, Plus, Trash2, ExternalLink, Play, X, Heart, Disc } from "lucide-react";

interface Song {
  id: string;
  song_title: string;
  link: string;
  created_at: string;
}

export default function PlaylistPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", link: "" });

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    try {
      const { data, error } = await supabase
        .from("playlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error: any) {
      toast.error("Tuning our instruments...");
      setSongs([
        { 
          id: '1', 
          song_title: "Perfect - Ed Sheeran", 
          link: "https://open.spotify.com/track/0tgVpS3mR0pYdfFvTTGPpZ", 
          created_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          song_title: "Conversations in the Dark - John Legend", 
          link: "https://open.spotify.com/track/29909797087654", 
          created_at: new Date().toISOString() 
        },
        {
          id: '3',
          song_title: "Lover - Taylor Swift",
          link: "https://open.spotify.com/track/1dGr1psI1pw3asZdykLs6u",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addSong(e: React.FormEvent) {
    e.preventDefault();
    if (!newSong.title.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("playlist")
        .insert([{ 
          song_title: newSong.title, 
          link: newSong.link,
          user_id: userData.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      setSongs([data, ...songs]);
      setNewSong({ title: "", link: "" });
      setIsAdding(false);
      toast.success("Song added to our soundtrack! 🎵");
    } catch (error: any) {
      toast.error("Failed to add song");
    }
  }

  async function deleteSong(id: string) {
    try {
      const { error } = await supabase.from("playlist").delete().eq("id", id);
      if (error) throw error;
      setSongs(songs.filter((s) => s.id !== id));
      toast.success("Song removed");
    } catch (error: any) {
      toast.error("Failed to delete song");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <PageHeader 
        title="Our Soundtrack" 
        subtitle="The songs that tell our story, one beat at a time." 
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
          {isAdding ? "Close Editor" : "Add a Special Song"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-16 overflow-hidden"
          >
            <Card className="max-w-2xl mx-auto">
              <form onSubmit={addSong} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Song & Artist</label>
                    <input
                      required
                      value={newSong.title}
                      onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                      placeholder="e.g. Perfect - Ed Sheeran"
                      className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium text-pink-900 placeholder:text-pink-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Spotify or YouTube Link</label>
                    <input
                      value={newSong.link}
                      onChange={(e) => setNewSong({ ...newSong, link: e.target.value })}
                      placeholder="https://open.spotify.com/..."
                      className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium text-pink-900 placeholder:text-pink-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-pink-600 transition-all shadow-xl shadow-pink-100"
                >
                  Add to Playlist <Music className="w-5 h-5" />
                </button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <LoadingSpinner />
      ) : songs.length > 0 ? (
        <div className="space-y-6">
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-pink-50 rounded-3xl translate-y-1 opacity-0 group-hover:opacity-100 transition-all" />
                <Card className="relative flex items-center justify-between p-4 md:p-6">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-500"
                    >
                      <Disc className="w-8 h-8 text-pink-500 group-hover:text-white transition-colors" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-pink-900 group-hover:text-pink-600 transition-colors">
                        {song.song_title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-pink-300 font-bold uppercase tracking-[0.2em]">
                          Treasured Memory
                        </span>
                        <div className="w-1 h-1 bg-pink-100 rounded-full" />
                        <span className="text-[10px] text-pink-200 font-bold uppercase tracking-[0.2em]">
                          {new Date(song.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {song.link && (
                      <motion.a 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={song.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-pink-50 text-pink-500 rounded-2xl hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </motion.a>
                    )}
                    <button
                      onClick={() => deleteSong(song.id)}
                      className="p-4 text-gray-200 hover:text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState message="The music has stopped. Let's add some songs to our love story!" icon={Music} />
      )}
      
      <div className="mt-20 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Heart className="w-16 h-16 text-pink-50/50 mx-auto fill-pink-50/50" />
        </motion.div>
        <p className="text-pink-200 font-medium italic mt-6 text-xl">
          Music is what feelings sound like.
        </p>
      </div>
    </div>
  );
}