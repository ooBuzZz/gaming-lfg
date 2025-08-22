import { Link } from "react-router-dom";
import type { Note } from "../types";

// Format a human-friendly relative time
const timeAgo = (dateStr: string) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const NoteItem = ({ note }: { note: Note }) => {
  return (
    <div className="note-item">
      <Link to={`/note/${note.id}`} className="note-link">
        <div className="note-header">
          <h3 className="note-title">{note.title}</h3>
          <span className="note-author">@{note.author.username}</span>
        </div>
        <div className="note-body">
          <p>{note.body}</p>
        </div>
        <div className="note-tags">
          <span className="tag game">{note.tags.game}</span>
          <span className="tag platform">{note.tags.platform}</span>
          <span className="tag region">{note.tags.region}</span>
          {note.tags.skillLevel && <span className="tag skill-level">{note.tags.skillLevel}</span>}
          {note.tags.voice && <span className="tag voice">Mic</span>}
        </div>
      </Link>
      <div className="note-footer">
        <span>{note.replyCount} replies</span>
        <span>active {timeAgo(note.lastActivityAt)}</span>
      </div>
    </div>
  );
};