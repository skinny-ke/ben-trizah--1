import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card, Input, Modal } from '@/components/ui/shared';
import { Music, Plus, ExternalLink, Trash2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Song {
  id: string;
  song_title: string;
  link: string;
}

const SAMPLE_SONGS = [
  { id: '1', song_title: 'Perfect - Ed Sheeran', link: 'https://open.spotify.com/track/0tgVpS36gh0pSTaXjA6N9l' },
  { id: '2', song_title: 'Lover - Taylor Swift', link: 'https://open.spotify.com/track/1dGrvSjrUDpfs2qSrzptmC' },
  { id: '3', song_title: "Say You Won't Let Go - James Arthur", link: 'https://open.spotify.com/track/5uCax9HTNlzGybSLQvX9fq' },
];

export default function Playlist() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase.from('playlist').select('*');
      if (error) throw error;
      setSongs(data?.length ? data : SAMPLE_SONGS);
    } catch (error) {
      setSongs(SAMPLE_SONGS);
    }
  };

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('playlist').insert([{ song_title: songTitle, link }]).select();
      if (error) throw error;
      if (data) {
        setSongs([...songs, data[0]]);
      }
      setIsModalOpen(false);
      setSongTitle(''); setLink('');
      toast.success('Song added! 🎵');
    } catch (error) {
      setSongs([...songs, { id: Math.random().toString(), song_title: songTitle, link }]);
      setIsModalOpen(false);
    }
  };

  const deleteSong = async (id: string) => {
    try {
      await supabase.from('playlist').delete().eq('id', id);
      setSongs(songs.filter(s => s.id !== id));
      toast.success('Song removed');
    } catch (error) {
      setSongs(songs.filter(s => s.id !== id));
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4"><Music size={32} className="text-rose-400" /></div>
        <h1 className="text-3xl font-bold text-stone-800">Our Playlist</h1>
        <p className="text-stone-500">The soundtrack to our love story.</p>
      </header>
      <div className="flex justify-end mb-8">
        <Button onClick={() => setIsModalOpen(true)} className="rounded-full"><Plus size={18} /> Add Song</Button>
      </div>
      <div className="space-y-4">
        {songs.map((song) => (
          <motion.div key={song.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-4 group hover:bg-rose-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-full text-rose-500"><PlayCircle size={24} /></div>
                <div>
                  <h3 className="font-bold text-stone-800">{song.song_title}</h3>
                  {song.link && <a href={song.link} target="_blank" className="text-xs text-rose-400 hover:underline flex items-center gap-1 mt-1">Open in Spotify</a>}
                </div>
              </div>
              <button onClick={() => deleteSong(song.id)} className="text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-2"><Trash2 size={18} /></button>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a Song">
        <form onSubmit={addSong} className="space-y-4">
          <Input value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="Song Title & Artist" required />
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Spotify Link" />
          <Button type="submit" className="w-full">Add to Playlist</Button>
        </form>
      </Modal>
    </main>
  );
}