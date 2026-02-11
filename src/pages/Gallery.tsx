import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card, Modal } from '@/components/ui/shared';
import { Image as ImageIcon, Plus, Upload, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Memory {
  id: string;
  image_url: string;
  caption: string;
  created_at: string;
  user_id?: string | null;
}

const SAMPLE_MEMORIES = [
  { 
    id: '1', 
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5117801-d6d0-4cd7-9e58-3de6b4b36fcf/memory-placeholder-1-6813051f-1770816831678.webp', 
    caption: 'Sunset walks with you are my favorite part of the day.',
    created_at: new Date().toISOString()
  },
  { 
    id: '2', 
    image_url: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c5117801-d6d0-4cd7-9e58-3de6b4b36fcf/memory-placeholder-2-ea476442-1770816830054.webp', 
    caption: 'The flowers you got me just because... ❤️',
    created_at: new Date().toISOString()
  },
];

export default function Gallery() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const formattedData: Memory[] = (data || []).map((m: any) => ({
        id: m.id,
        image_url: m.image_url,
        caption: m.caption || "",
        created_at: m.created_at || new Date().toISOString(),
        user_id: m.user_id
      }));

      setMemories(formattedData.length ? formattedData : SAMPLE_MEMORIES);
    } catch (error) {
      setMemories(SAMPLE_MEMORIES);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;
    try {
      const { data, error } = await supabase.from('memories').insert([{ image_url: imagePreview, caption }]).select();
      if (error) throw error;
      
      const newMemory: Memory = {
        id: data[0].id,
        image_url: data[0].image_url,
        caption: data[0].caption || "",
        created_at: data[0].created_at || new Date().toISOString(),
        user_id: data[0].user_id
      };

      setMemories([newMemory, ...memories]);
      setIsModalOpen(false);
      setCaption(''); setImagePreview(null);
      toast.success('Memory captured forever! 📸');
    } catch (error) {
      setMemories([{ id: Math.random().toString(), image_url: imagePreview, caption, created_at: new Date().toISOString() }, ...memories]);
      setIsModalOpen(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <ImageIcon size={32} className="text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800">Memory Gallery</h1>
        <p className="text-stone-500">A picture is worth a thousand I-love-yous.</p>
      </header>
      <div className="flex justify-end mb-8">
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full"><Plus size={18} /> Add Memory</Button>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {memories.map((memory) => (
          <motion.div key={memory.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="break-inside-avoid">
            <Card className="p-2 overflow-hidden group hover:shadow-xl transition-all duration-500 border-none bg-white shadow-md">
              <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
                <img src={memory.image_url} alt={memory.caption} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full"><Heart size={16} className="text-rose-500 fill-rose-500" /></div>
              </div>
              <p className="text-stone-700 text-sm font-medium leading-snug px-2">{memory.caption}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Capture a Memory">
        <form onSubmit={addMemory} className="space-y-4">
          <div className="relative aspect-video bg-stone-50 rounded-2xl border-2 border-dashed border-rose-100 flex flex-col items-center justify-center overflow-hidden">
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <><Upload size={32} className="text-rose-300" /><input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0" /></>}
          </div>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 min-h-[80px]" placeholder="Caption..." required />
          <Button type="submit" className="w-full">Save to Vault</Button>
        </form>
      </Modal>
    </main>
  );
}