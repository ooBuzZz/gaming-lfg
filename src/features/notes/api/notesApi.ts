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
  // Use a view that includes activity metrics for active/hot sorting
  const source = sort === 'active' || sort === 'hot' ? 'notes_with_activity' : 'notes';
  let query = supabase.from(source).select('*');
  
  // Apply filters
  if (filters.game) {
    query = query.eq('tags->>game', filters.game);
  }
  if (filters.platform) {
    query = query.eq('tags->>platform', filters.platform);
  }
  if (filters.skillLevel) {
    query = query.eq('tags->>skillLevel', filters.skillLevel);
  }
  
  // Apply sorting
  switch (sort) {
    case 'new':
      query = query.order('created_at', { ascending: false });
      break;
    case 'active':
      // Prefer last activity if available, fall back to updated_at/created_at
      query = query
        .order('last_activity_at', { ascending: false, nullsFirst: false })
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      break;
    case 'hot':
      // Order by hot_score if present; otherwise roughly by recent activity
      query = query
        .order('hot_score', { ascending: false, nullsFirst: false })
        .order('last_activity_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
      break;
  }
  
  const { data, error } = await query;
  
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
