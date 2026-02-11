import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card } from '@/components/ui/shared';
import { MessageSquare, Plus, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  created_at: string;
  user_id?: string | null;
}

const SAMPLE_NOTES = [
  { id: '1', content: 'Trizah, thank you for choosing us every day 💖', created_at: new Date().toISOString() },
  { id: '2', content: 'I love the way you smile when you talk about your dreams. ✨', created_at: new Date().toISOString() },
  { id: '3', content: 'Counting down the days until our next adventure together! ✈️', created_at: new Date().toISOString() },
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData: Note[] = (data || []).map((n: any) => ({
        id: n.id,
        content: n.content || "",
        created_at: n.created_at || new Date().toISOString(),
        user_id: n.user_id
      }));

      setNotes(formattedData.length ? formattedData : SAMPLE_NOTES);
    } catch (error) {
      setNotes(SAMPLE_NOTES);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ content: newNote }])
        .select();

      if (error) throw error;
      
      const formattedNote: Note = {
        id: data[0].id,
        content: data[0].content || "",
        created_at: data[0].created_at || new Date().toISOString(),
        user_id: data[0].user_id
      };

      setNotes([formattedNote, ...notes]);
      setNewNote('');
      toast.success('Note added to our vault ✨');
    } catch (error) {
      const localNote = { id: Math.random().toString(), content: newNote, created_at: new Date().toISOString() };
      setNotes([localNote, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await supabase.from('notes').delete().eq('id', id);
      setNotes(notes.filter((n) => n.id !== id));
      toast.success('Note removed');
    } catch (error) {
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <MessageSquare size={32} className="text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800">Love Notes</h1>
        <p className="text-stone-500">Little reminders of why I love you.</p>
      </header>

      <form onSubmit={addNote} className="mb-10 relative">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a sweet note..."
          className="w-full bg-white border border-rose-100 rounded-2xl p-4 pr-16 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200 min-h-[120px] resize-none"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute bottom-4 right-4 h-10 w-10"
          disabled={!newNote.trim()}
        >
          <Plus size={20} />
        </Button>
      </form>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group"
            >
              <Card className="relative hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-stone-700 leading-relaxed italic whitespace-pre-wrap">
                    "{note.content}"
                  </p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-stone-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-rose-300 fill-rose-300" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                      Forever Yours
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}