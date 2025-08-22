import type { Note } from "../types";
import { NoteItem } from "./NoteItem";

export const NoteList = ({ notes }: { notes: Note[] }) => {
  if (notes.length === 0) {
    return <div className="empty-state">No notes found for the selected filters.</div>;
  }
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
};