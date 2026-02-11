"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader, LoadingSpinner, EmptyState, Card } from "@/components/ui/shared";
import { toast } from "sonner";
import { Calendar, Plus, Trash2, Heart, Clock, X, Send } from "lucide-react";

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  user_id?: string | null;
}

export default function TimelinePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    date: "",
    description: ""
  });

  // Anniversary Date: May 20th
  const ANNIVERSARY_DATE = new Date("2025-05-20T00:00:00");

  useEffect(() => {
    fetchMilestones();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const difference = ANNIVERSARY_DATE.getTime() - now.getTime();

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  }

  async function fetchMilestones() {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      
      const formattedData: Milestone[] = (data || []).map((m: any) => ({
        id: m.id,
        date: m.date || new Date().toISOString(),
        title: m.title || "Untitled Event",
        description: m.description || "",
        user_id: m.user_id
      }));
      
      setMilestones(formattedData);
    } catch (error: any) {
      toast.error("Connecting to our journey...");
      setMilestones([
        { id: '1', date: '2023-05-20', title: 'The Day It All Began', description: 'The moment our paths crossed and everything changed for the better.' },
        { id: '2', date: '2024-02-14', title: "First Valentine's together", description: 'An unforgettable night filled with laughter and love. ❤️' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!newMilestone.title || !newMilestone.date) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("milestones")
        .insert([{ 
          ...newMilestone, 
          user_id: userData.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      const formattedMilestone: Milestone = {
        id: data.id,
        date: data.date,
        title: data.title,
        description: data.description || "",
        user_id: data.user_id
      };

      setMilestones(prev => [...prev, formattedMilestone].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewMilestone({ title: "", date: "", description: "" });
      setIsAdding(false);
      toast.success("New milestone added! 🎉");
    } catch (error: any) {
      toast.error("Failed to add milestone");
    }
  }

  async function deleteMilestone(id: string) {
    try {
      const { error } = await supabase.from("milestones").delete().eq("id", id);
      if (error) throw error;
      setMilestones(milestones.filter((m) => m.id !== id));
      toast.success("Milestone removed");
    } catch (error: any) {
      toast.error("Failed to delete milestone");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <PageHeader 
        title="Our Journey" 
        subtitle="Walking hand in hand through every beautiful chapter." 
      />

      {/* Countdown Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-[2px] rounded-[3rem] shadow-xl shadow-pink-200">
          <div className="bg-white/10 backdrop-blur-md rounded-[2.9rem] p-8 md:p-12 text-white flex flex-col items-center text-center">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-white/20 p-4 rounded-full mb-6"
            >
              <Clock className="w-10 h-10" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold mb-8">Countdown to our 2-Year Anniversary</h3>
            <div className="grid grid-cols-4 gap-4 md:gap-12">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className="text-4xl md:text-6xl font-black tabular-nums tracking-tighter">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-70 mt-2 font-bold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-2 text-pink-100/60 font-medium italic">
              <Calendar className="w-4 h-4" />
              May 20, 2025
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center mb-16">
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
          {isAdding ? "Cancel" : "Add a New Milestone"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16 overflow-hidden"
          >
            <Card className="max-w-2xl mx-auto">
              <form onSubmit={addMilestone} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input
                      required
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      placeholder="e.g. Our First Kiss"
                      className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Date</label>
                    <input
                      required
                      type="date"
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                      className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">Short Description</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    placeholder="Tell the story in a few words..."
                    className="w-full p-4 bg-pink-50/30 border-none rounded-xl focus:ring-2 focus:ring-pink-200 outline-none font-medium h-24 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-100"
                >
                  Add to Our Journey <Send className="w-4 h-4" />
                </button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline List */}
      <div className="relative">
        {/* Center Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-pink-100 -translate-x-1/2" />

        {loading ? (
          <LoadingSpinner />
        ) : milestones.length > 0 ? (
          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 bg-white border-4 border-pink-400 rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-sm">
                  <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                </div>

                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                  <div className={`md:max-w-md ${index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}>
                    <Card className="relative group">
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="absolute top-4 right-4 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="inline-block px-3 py-1 bg-pink-50 text-pink-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                        {new Date(milestone.date).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <h3 className="text-xl font-bold text-pink-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 italic leading-relaxed">
                        "{milestone.description}"
                      </p>
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState message="Our story is just beginning. Let's add our first milestone!" icon={Calendar} />
        )}
      </div>
    </div>
  );
}