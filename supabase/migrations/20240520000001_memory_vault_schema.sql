-- Create tables for Ben & Trizah Memory Vault

-- Milestones Table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Memories Table
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Letters Table
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Playlist Table
CREATE TABLE IF NOT EXISTS public.playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_title TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist ENABLE ROW LEVEL SECURITY;

-- Create Policies (Only authenticated users can access)
DO $$ 
BEGIN
    -- Milestones
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milestones' AND policyname = 'Authenticated users can manage milestones') THEN
        CREATE POLICY "Authenticated users can manage milestones" ON public.milestones
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Memories
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memories' AND policyname = 'Authenticated users can manage memories') THEN
        CREATE POLICY "Authenticated users can manage memories" ON public.memories
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Notes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notes' AND policyname = 'Authenticated users can manage notes') THEN
        CREATE POLICY "Authenticated users can manage notes" ON public.notes
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Letters
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'letters' AND policyname = 'Authenticated users can manage letters') THEN
        CREATE POLICY "Authenticated users can manage letters" ON public.letters
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Playlist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'playlist' AND policyname = 'Authenticated users can manage playlist') THEN
        CREATE POLICY "Authenticated users can manage playlist" ON public.playlist
        FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Create Storage Bucket for Memories
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can upload memories') THEN
        CREATE POLICY "Authenticated users can upload memories" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'memories' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can view memories') THEN
        CREATE POLICY "Authenticated users can view memories" ON storage.objects
        FOR SELECT USING (bucket_id = 'memories' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can delete memories') THEN
        CREATE POLICY "Authenticated users can delete memories" ON storage.objects
        FOR DELETE USING (bucket_id = 'memories' AND auth.role() = 'authenticated');
    END IF;
END $$;