
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNoteById } from '../api/notesApi';

export const NoteDetailPage = () => {
    // This hook from react-router-dom gets parameters from the URL
    const { noteId } = useParams<{ noteId: string }>();

    // Fetch the specific note using its ID
    const { data: note, isLoading, isError } = useQuery({
        queryKey: ['note', noteId],
        queryFn: () => getNoteById(noteId!),
        enabled: !!noteId, // Only run the query if noteId is defined 
    });

    if (isLoading) {
        return <div className="loading-state">Loading note...</div>;
    }

    if (isError) {
        return <div className="error-state">Error loading note.</div>;
    }

    if (!note) {
        return <div className="error-state">Note not found.</div>;
    }
    
    return (
        <div className="note-detail-container">
            <Link to="/" className="back-link">&larr; Back to all posts</Link>
            <div className="note-detail-header">
                <h1>{note.title}</h1>
                <p>Posted by {note.author.username}</p>
            </div>
            <div className="note-detail-body">
                <p>{note.body}</p>
            </div>
            <div className="note-tags">
                <span className="tag game">{note.tags.game}</span>
                <span className="tag platform">{note.tags.platform}</span>
                <span className="tag region">{note.tags.region}</span>
                {note.tags.voice && <span className="tag voice">Mic Required</span>}
            </div>
            <hr style={{ margin: '2rem 0' }}/>
            <div className="replies-section">
                <h2>Replies ({note.replyCount})</h2>
                {/* The list of replies and "add reply" functionality would go here */}
                <p><i>Reply functionality coming soon!</i></p>
                </div>
            </div>
    );
};
