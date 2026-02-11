# Ben & Trizah - Memory App

A romantic, minimal digital sanctuary for Ben & Trizah to store their precious memories.

## Features
- **Notes**: Share sweet reminders and daily love notes.
- **Timeline**: A visual journey of key milestones in the relationship.
- **Gallery**: A shared space for photos (configured with Supabase Storage placeholders).
- **Open When...**: Special letters to be opened in specific moments.
- **Playlist**: A curated soundtrack of your love story.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Supabase (Auth, Database, Storage).
- **Styling**: Warm, minimal, cozy aesthetic with soft pink accents.

## Deployment Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase/migrations/20240520000000_initial_schema.sql`.
3. Go to **Project Settings > API** and copy your `URL` and `Anon Key`.
4. Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Vercel Deployment
1. Push this code to a GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` in the Vercel dashboard.
4. Click **Deploy**.

## Development
```bash
npm install
npm run dev