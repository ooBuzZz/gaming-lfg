export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'Mobile';
export type Region = 'NA-East' | 'NA-West' | 'EMEA' | 'Asia';
export type SkillLevel =
  | 'Rookie'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master'
  | 'Pro';
export type PlaytimeWindow = 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Late Night';

export interface Author {
  id: string;
  username: string;
}

export interface NoteTags {
  game: string;
  platform: Platform;
  region: Region;
  skillLevel?: SkillLevel; // optional
  voice: boolean;
  playtimeWindow?: PlaytimeWindow; // optional
}

export interface Note {
  id: string;
  title: string;
  body: string;
  author: Author;
  tags: NoteTags;
  createdAt: string;
  lastActivityAt: string;
  replyCount: number;
}

// Filters and API params
export interface NoteFilters {
  game?: string;
  platform?: Platform;
  skillLevel?: SkillLevel;
  playtimeWindow?: PlaytimeWindow;
}

export interface GetNotesParams {
  filters: NoteFilters;
  sort: 'new' | 'active' | 'hot';
}