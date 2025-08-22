import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterSidebar } from '../components/FilterSidebar';
import { NoteList } from '../components/NoteList';
import { getNotes } from '../api/notesApi';
import type { NoteFilters } from '../types';
import { CreateNoteForm } from '../components/CreateNoteForm';

export const NotesPage = () => {
  const [filters, setFilters] = useState<NoteFilters>({});
  const [sort, setSort] = useState<'new' | 'active' | 'hot'>('active');
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);

  // useQuery handles all the fetching, caching, loading, and error states for us
  const { data: notes, isLoading, isError, error } = useQuery({
    queryKey: ['notes', filters, sort], // Unique key for the query
    queryFn: () => getNotes({ filters, sort }), // Function to fetch data
  });

  return (
    <div className="page-layout">
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
      />
      <main className="main-content">
        <div className="main-header">
          <h2>Looking for Group</h2>
          <button className="create-note-btn" onClick={() => setCreateFormVisible(!isCreateFormVisible)}>
            {isCreateFormVisible ? 'Cancel' : 'Create Post'}
          </button>
        </div>
        {isCreateFormVisible && <CreateNoteForm onClose={() => setCreateFormVisible(false)} />}
        
        {isLoading && (
          <div className="loading-state">Loading notes...</div>
        )}
        {isError && <div className="error-state">Error: {error instanceof Error ? error.message : 'Failed to fetch notes'}</div>}
        {notes && <NoteList notes={notes} />}
      </main>
    </div>
  );
};