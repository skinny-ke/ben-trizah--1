import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card, Input, Modal } from '@/components/ui/shared';
import { Calendar, Plus, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  user_id?: string | null;
  created_at?: string | null;
}

const SAMPLE_MILESTONES = [
  { id: '1', date: '2023-02-14', title: "First Valentine's together", description: "Unforgettable night under the stars. ❤️" },
  { id: '2', date: '2023-06-15', title: "First Road Trip", description: "Driving to the coast, singing our favorite songs." },
  { id: '3', date: '2023-11-20', title: "Met the Family", description: "A nervous but beautiful day." },
];

export default function Timeline() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    fetchMilestones();
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      const formattedData: Milestone[] = (data || []).map((m: any) => ({
        id: m.id,
        date: m.date || new Date().toISOString(),
        title: m.title || "Untitled Event",
        description: m.description || "",
        user_id: m.user_id,
        created_at: m.created_at
      }));

      setMilestones(formattedData.length ? formattedData : SAMPLE_MILESTONES);
    } catch (error) {
      setMilestones(SAMPLE_MILESTONES);
    }
  };

  const calculateCountdown = () => {
    const target = new Date('2025-02-14T00:00:00');
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft({ days, hours, mins });
    }
  };

  const addMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert([{ title, date, description }])
        .select();

      if (error) throw error;
      if (data) {
        const newMilestone: Milestone = {
          id: data[0].id,
          date: data[0].date,
          title: data[0].title,
          description: data[0].description || "",
          user_id: data[0].user_id,
          created_at: data[0].created_at
        };
        setMilestones([newMilestone, ...milestones].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      setIsModalOpen(false);
      setTitle(''); setDate(''); setDescription('');
      toast.success('New milestone saved!');
    } catch (error) {
      setMilestones([{ id: Math.random().toString(), title, date, description }, ...milestones].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setIsModalOpen(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Calendar size={32} className="text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800">Our Timeline</h1>
        <p className="text-stone-500">The journey of Ben & Trizah.</p>
      </header>

      <Card className="mb-12 bg-rose-50/50 border-rose-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-rose-600 font-medium mb-3">
            <Sparkles size={18} />
            <span>2-Year Anniversary Countdown</span>
            <Sparkles size={18} />
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-stone-800">{timeLeft.days}</span>
              <span className="text-xs uppercase text-stone-400 font-bold">Days</span>
            </div>
            <div className="text-3xl font-bold text-stone-300">:</div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-stone-800">{timeLeft.hours}</span>
              <span className="text-xs uppercase text-stone-400 font-bold">Hours</span>
            </div>
            <div className="text-3xl font-bold text-stone-300">:</div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-stone-800">{timeLeft.mins}</span>
              <span className="text-xs uppercase text-stone-400 font-bold">Mins</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-stone-700">Milestones</h2>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="rounded-full">
          <Plus size={18} className="mr-1" /> Add Milestone
        </Button>
      </div>

      <div className="relative border-l-2 border-rose-100 ml-4 space-y-10 pb-10">
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative pl-10"
          >
            <div className="absolute left-[-9px] top-1 w-4 h-4 bg-rose-400 rounded-full border-4 border-white shadow-sm" />
            <div className="flex items-center gap-2 mb-1 text-rose-500 text-sm font-semibold">
              <Clock size={14} />
              {new Date(milestone.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Card className="shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-2">{milestone.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{milestone.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Milestone">
        <form onSubmit={addMilestone} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Milestone Title" required />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 focus:outline-none min-h-[100px]"
            placeholder="Description..."
            required
          />
          <Button type="submit" className="w-full">Save Milestone</Button>
        </form>
      </Modal>
    </main>
  );
}