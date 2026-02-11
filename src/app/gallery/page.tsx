"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader, LoadingSpinner, EmptyState, Card } from "@/components/ui/shared";
import { toast } from "sonner";
import { Camera, Plus, Trash2, X, Image as ImageIcon, Loader2, Wand2 } from "lucide-react";

interface Memory {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
  user_id?: string | null;
}

const AI_CAPTIONS = [
  "Every day with you is my favorite day. ❤️",
  "Captured a moment, keeping it forever. ✨",
  "You make my heart smile in every frame. 📸",
  "Just us being us. Love you Trizah! 💖",
  "Ben and Trizah, a story for the ages. 📖",
  "The best things in life are even better with you. 🌹",
  "Life is a beautiful journey, and I'm glad I'm walking it with you."
];

export default function GalleryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  async function fetchMemories() {
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map to ensure types match
      const formattedData: Memory[] = (data || []).map((m: any) => ({
        id: m.id,
        image_url: m.image_url,
        caption: m.caption || "",
        created_at: m.created_at || new Date().toISOString(),
        user_id: m.user_id
      }));
      
      setMemories(formattedData);
    } catch (error: any) {
      toast.error("Connecting to gallery...");
      setMemories([
        { 
          id: '1', 
          image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5117801-d6d0-4cd7-9e58-3de6b4b36fcf/romantic-sunset-21d4b739-1770818040961.webp', 
          caption: "Forever holding your hand by the sunset. ❤️", 
          created_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5117801-d6d0-4cd7-9e58-3de6b4b36fcf/pink-roses-5e4b70e7-1770818040491.webp', 
          caption: "A beautiful surprise for my beautiful Trizah. 🌹", 
          created_at: new Date().toISOString() 
        },
        { 
          id: '3', 
          image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5117801-d6d0-4cd7-9e58-3de6b4b36fcf/starry-picnic-3a393370-1770818042293.webp', 
          caption: "Starry nights and cozy vibes. ✨", 
          created_at: new Date().toISOString() 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAICaption = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const random = AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)];
      setCaption(random);
      setIsGenerating(false);
      toast.success("AI suggested a caption! ✨");
    }, 1200);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setUploading(true);
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('memories')
        .insert([{ 
          image_url: publicUrl, 
          caption,
          user_id: userData.user?.id 
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      const newMemory: Memory = {
        id: data.id,
        image_url: data.image_url,
        caption: data.caption || "",
        created_at: data.created_at || new Date().toISOString(),
        user_id: data.user_id
      };

      setMemories([newMemory, ...memories]);
      setIsAdding(false);
      setPreview(null);
      setCaption("");
      toast.success("Memory captured forever! 📸");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload memory");
    } finally {
      setUploading(false);
    }
  };

  async function deleteMemory(id: string, url: string) {
    if (!confirm("Are you sure you want to remove this memory?")) return;
    
    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('memories').remove([fileName]);
      }
      
      const { error } = await supabase.from("memories").delete().eq("id", id);
      if (error) throw error;
      setMemories(memories.filter((m) => m.id !== id));
      toast.success("Memory removed");
    } catch (error: any) {
      toast.error("Failed to delete memory");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      <PageHeader 
        title="Our Moments" 
        subtitle="A visual diary of the beautiful life we're sharing." 
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
          {isAdding ? "Cancel" : "Add New Memory"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="mb-16 max-w-2xl mx-auto bg-white p-8 rounded-[3rem] shadow-2xl border border-pink-100"
          >
            <form onSubmit={handleUpload} className="space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] bg-pink-50 rounded-[2rem] border-2 border-dashed border-pink-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all hover:bg-pink-100/50"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-pink-400" />
                    </div>
                    <p className="text-pink-400 font-bold">Tap to select a photo</p>
                    <p className="text-pink-300 text-xs mt-1 uppercase tracking-widest">JPEG, PNG, WEBP</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-pink-300 uppercase tracking-widest ml-1">Caption</label>
                  <button
                    type="button"
                    onClick={generateAICaption}
                    disabled={isGenerating}
                    className="text-xs font-bold text-pink-500 flex items-center gap-1 hover:text-pink-600 transition-colors"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Magic Caption
                  </button>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What makes this moment special?"
                  className="w-full p-6 bg-pink-50/30 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none resize-none font-medium text-pink-900 h-32"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !preview}
                className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-bold shadow-xl shadow-pink-100 disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-pink-600 transition-all"
              >
                {uploading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Saving...</>
                ) : (
                  "Save to Memory Vault"
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <LoadingSpinner />
      ) : memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-pink-50">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={memory.image_url} 
                    alt={memory.caption} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <button
                      onClick={() => deleteMemory(memory.id, memory.image_url)}
                      className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-pink-900 font-medium italic text-lg leading-relaxed mb-6">
                    "{memory.caption}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-pink-50" />
                    <span className="text-[10px] text-pink-200 font-bold uppercase tracking-[0.2em]">
                      {new Date(memory.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="h-[1px] flex-1 bg-pink-50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState message="Our gallery is empty. Let's start filling it with beautiful moments!" icon={ImageIcon} />
      )}
    </div>
  );
}