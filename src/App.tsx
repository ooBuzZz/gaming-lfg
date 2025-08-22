import { Routes, Route } from 'react-router-dom';
import { NotesPage } from './features/notes/pages/NotesPage';
import { NoteDetailPage } from './features/notes/pages/NoteDetailPage';
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gamers Forum</h1>
        <nav>
          {/* Add nav links here later */}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<NotesPage />} />
        {/* Later, add the detail page route like this: */}
        <Route path="/note/:noteId" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
