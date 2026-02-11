-- Create tables for Ben & Trizah Memory Vault

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Memories table (Gallery)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Letters table (Open-When Letters)
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Playlist table
CREATE TABLE IF NOT EXISTS playlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_title TEXT NOT NULL,
  artist TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read milestones" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert milestones" ON milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update milestones" ON milestones FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete milestones" ON milestones FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read memories" ON memories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert memories" ON memories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete memories" ON memories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read notes" ON notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert notes" ON notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete notes" ON notes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read letters" ON letters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert letters" ON letters FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read playlist" ON playlist FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert playlist" ON playlist FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to delete playlist" ON playlist FOR DELETE TO authenticated USING (true);

-- Insert Sample Data (Conceptual - needs user_id to be valid in real RLS, but here for structure)
-- Note: In production, user_id should be set to Ben or Trizah's ID
INSERT INTO letters (title, content) VALUES 
('Open when you miss me', 'My dearest, if you are reading this, know that I am likely thinking of you right at this moment. Distance is just a test to see how far love can travel...'),
('Open when you are having a bad day', 'Hey beautiful/handsome, I am sorry today was tough. Take a deep breath. You are stronger than any challenge today brought...'),
('Open when you need a laugh', 'Remember that time we... (Insert your favorite funny memory here). You have the most beautiful laugh in the world!');

INSERT INTO milestones (date, title, description) VALUES 
('2023-05-20', 'The Day It All Began', 'The moment our paths crossed and everything changed for the better.'),
('2024-02-14', 'First Valentine’s together', 'An unforgettable night filled with laughter and love.');