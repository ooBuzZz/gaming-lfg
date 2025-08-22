import { supabase } from '../../../supabaseClient';
import type { GetNotesParams, Note, NoteTags } from '../types';

interface SupabaseNote {
  id: string;
  title: string;
  body: string;
  author_username: string;
  tags: NoteTags;
  created_at: string;
  updated_at?: string;
  last_activity_at?: string;
  reply_count?: number;
  hot_score?: number;
}

const fromSupabase = (post: SupabaseNote): Note => ({
  id: post.id,
  title: post.title,
  body: post.body,
  author: { id: post.author_username, username: post.author_username },
  tags: post.tags,
  createdAt: post.created_at,
  lastActivityAt: post.last_activity_at ?? post.updated_at ?? post.created_at,
  replyCount: post.reply_count ?? 0,
});

// Get all posts
export const getNotes = async ({ filters, sort }: GetNotesParams): Promise<Note[]> => {
  const wantsActivity = sort === 'active' || sort === 'hot';
  const source = wantsActivity ? 'notes_with_activity' : 'notes';

  const buildQuery = (table: string) => {
    let q = supabase.from(table).select('*');
    if (filters.game) q = q.eq('tags->>game', filters.game);
    if (filters.platform) q = q.eq('tags->>platform', filters.platform);
    if (filters.skillLevel) q = q.eq('tags->>skillLevel', filters.skillLevel);
    if (filters.playtimeWindow) q = q.eq('tags->>playtimeWindow', filters.playtimeWindow);

    switch (sort) {
      case 'new':
        q = q.order('created_at', { ascending: false });
        break;
      case 'active':
        if (table === 'notes_with_activity') {
          q = q
            .order('last_activity_at', { ascending: false, nullsFirst: false })
            .order('updated_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });
        } else {
          // Fallback when view doesn't exist
          q = q.order('created_at', { ascending: false });
        }
        break;
      case 'hot':
        if (table === 'notes_with_activity') {
          q = q
            .order('hot_score', { ascending: false, nullsFirst: false })
            .order('last_activity_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });
        } else {
          // Fallback when view doesn't exist
          q = q.order('created_at', { ascending: false });
        }
        break;
    }
    return q;
  };

  // First attempt (view when needed)
  let { data, error } = await buildQuery(source);

  // Graceful fallback if the view isn't present yet in the DB
  if (error && wantsActivity) {
    const res = await buildQuery('notes');
    const { data: fallbackData, error: fallbackError } = await res;
    if (fallbackError) {
      throw new Error(`Failed to fetch notes: ${fallbackError.message}`);
    }
    return (fallbackData || []).map(fromSupabase);
  }

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
  return (data || []).map(fromSupabase);
};

// Get a single note by ID
export const getNoteById = async (id: string): Promise<Note | null> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch note: ${error.message}`);
  }
  
  return fromSupabase(data);
};

// Create a new note
export interface CreateNoteData {
  title: string;
  body: string;
  tags: NoteTags;
  author_username: string;
}

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        title: noteData.title,
        body: noteData.body,
        tags: noteData.tags,
        author_username: noteData.author_username,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();
    
  if (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }
  
  return fromSupabase(data);
};
