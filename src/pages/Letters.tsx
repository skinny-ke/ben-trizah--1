import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, Modal } from '@/components/ui/shared';
import { Mail, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Letter {
  id: string;
  title: string;
  content: string;
}

const SAMPLE_LETTERS = [
  { 
    id: '1', 
    title: 'Open when you miss me', 
    content: `Hey love,

I know being apart is hard, but just remember that every mile between us is a testament to how strong we are. I'm probably thinking about you right now, too. Close your eyes, take a deep breath, and feel my hug.

Always yours,
Ben` 
  },
  { 
    id: '2', 
    title: 'Open when you have a bad day', 
    content: `My dearest Trizah,

I'm so sorry today was tough. I wish I could be there to just hold you and tell you everything will be okay. You are the strongest, most resilient person I know.

Love you more than words,` 
  },
  { 
    id: '3', 
    title: 'Open when we just had a fight', 
    content: `I hate it when we're not okay. Please remember that even when I'm frustrated, I still love you more than anything. Let's put our egos aside and come back to each other.` 
  },
];

export default function Letters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const { data, error } = await supabase.from('letters').select('*');
      if (error) throw error;
      setLetters(data?.length ? data : SAMPLE_LETTERS);
    } catch (error) {
      setLetters(SAMPLE_LETTERS);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <div className="flex justify-center mb-4"><Mail size={32} className="text-rose-400" /></div>
        <h1 className="text-3xl font-bold text-stone-800">Open-When Letters</h1>
        <p className="text-stone-500">Read these only when the time is right.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {letters.map((letter) => (
          <motion.div key={letter.id} whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => setSelectedLetter(letter)}>
            <Card className="h-full border-rose-100 flex flex-col items-center justify-center p-8 text-center bg-white/60 hover:bg-white group">
              <div className="mb-4 w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                <Lock size={24} className="text-rose-300 group-hover:hidden" />
                <Unlock size={24} className="text-rose-500 hidden group-hover:block" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-rose-500">{letter.title}</h3>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal isOpen={!!selectedLetter} onClose={() => setSelectedLetter(null)} title={selectedLetter?.title || ''}>
        <div className="p-4 md:p-8">
          <p className="text-stone-700 leading-loose text-lg whitespace-pre-wrap font-serif italic">{selectedLetter?.content}</p>
          <div className="mt-12 text-right">
            <p className="font-serif italic text-stone-500">With all my love,</p>
            <p className="font-serif italic text-xl font-bold text-rose-400 mt-1">Ben</p>
          </div>
        </div>
      </Modal>
    </main>
  );
}