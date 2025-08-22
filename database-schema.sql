-- Create the notes table for the gamer-notes application
CREATE TABLE public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_username TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index on created_at for better performance when sorting by date
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);

-- Create an index on author_username for filtering by author
CREATE INDEX idx_notes_author ON public.notes(author_username);

-- Create a GIN index on the tags JSONB column for efficient filtering
CREATE INDEX idx_notes_tags ON public.notes USING GIN (tags);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read notes (adjust as needed)
CREATE POLICY "Allow public read access" ON public.notes
    FOR SELECT USING (true);

-- Create a policy that allows anyone to insert notes (adjust as needed)
CREATE POLICY "Allow public insert access" ON public.notes
    FOR INSERT WITH CHECK (true);

-- Sample data (optional - remove if you don't want test data)
INSERT INTO public.notes (title, body, author_username, tags) VALUES 
(
    'Looking for Apex teammates',
    'Need some chill players for ranked. I''m currently Gold 3 and looking to push to Plat. Must have mic!',
    'TestUser1',
    '{"game": "Apex Legends", "platform": "PC", "region": "NA-East", "voice": true, "playtimeWindow": "Evening", "skillLevel": "Gold"}'::jsonb
),
(
    'Valorant scrimmage tonight',
    'Setting up a 5v5 custom match around 8PM EST. All skill levels welcome.',
    'TestUser2', 
    '{"game": "Valorant", "platform": "PC", "region": "NA-East", "voice": false, "playtimeWindow": "Night", "skillLevel": "Silver"}'::jsonb
),
(
    'League of Legends duo queue',
    'Looking for a support main to climb ranked. I''m an ADC main currently in Silver 2. Usually play mornings before work.',
    'TestUser3',
    '{"game": "League of Legends", "platform": "PC", "region": "NA-West", "voice": true, "playtimeWindow": "Morning", "skillLevel": "Silver"}'::jsonb
),
(
    'Rocket League casual sessions',
    'Anyone want to play some casual 3v3s this afternoon? Just looking to have fun and improve rotation. All skill levels welcome!',
    'TestUser4',
    '{"game": "Rocket League", "platform": "PlayStation", "region": "EMEA", "voice": false, "playtimeWindow": "Afternoon", "skillLevel": "Gold"}'::jsonb
),
(
    'Call of Duty late night squad',
    'Need 2 more for Warzone trios. Playing late night sessions, usually after midnight. Must be Diamond+ skill level.',
    'TestUser5',
    '{"game": "Call of Duty", "platform": "Xbox", "region": "NA-East", "voice": true, "playtimeWindow": "Late Night", "skillLevel": "Diamond"}'::jsonb
);
