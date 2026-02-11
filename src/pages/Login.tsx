import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '@/components/ui/shared';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Access denied. Please check your credentials.');
    } else {
      toast.success('Welcome back, love! ❤️');
      navigate('/notes');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-rose-100 p-4 rounded-full">
            <Heart className="text-rose-500 fill-rose-500" size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">The Vault</h1>
        <p className="text-stone-500 mb-8">Please sign in to access our memories</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-sm font-medium text-stone-600 ml-1">Email</label>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-medium text-stone-600 ml-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Entering...' : 'Unlock Vault'}
          </Button>
        </form>
        
        <p className="mt-8 text-xs text-stone-400">
          Only Ben & Trizah can enter.
        </p>
      </Card>
    </div>
  );
}