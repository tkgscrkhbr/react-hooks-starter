import { NotePreview } from "../cmps/NotePreview.jsx";
import { noteService } from "../services/note.service.js";
import { ColorPicker } from "./ColorPicker.jsx";

const { useState, useEffect, useRef } = React;

export function NoteList({ notes, onSelectNoteId, onRemoveNote }) {
  const [colorPickerNoteId, setColorPickerNoteId] = useState(null);
  const [notesState, setNotesState] = useState([]);

  useEffect(() => {
    setNotesState(notes);
  }, [notes]);

  function onChangeColor(noteId, color) {
    const noteToUpdate = notesState.find((note) => note.id === noteId);
    if (!noteToUpdate) return;

    const updatedNote = {
      ...noteToUpdate,
      style: {
        ...noteToUpdate.style,
        backgroundColor: color,
      },
    };

    noteService
      .save(updatedNote)
      .then((savedNote) => {
        const updatedNotes = notesState.map((note) =>
          note.id === savedNote.id ? savedNote : note
        );
        setNotesState(updatedNotes);
      })
      .catch((error) => {
        console.error("Error saving note:", error);
      });
    setColorPickerNoteId(null);
  }

  return (
    <section className="note-list-container">
      <ul className="note-list">
        {notesState.map((note) => (
          <li key={note.id} className="note-item" style={note.style}>
            <NotePreview note={note} />
            <div className="icones-display">

              <section className="note-actions">
                <div className="other-icons">
                  <span
                    onClick={() => onRemoveNote(note.id)}
                    className="material-symbols-outlined icone-hover"
                  >
                    delete
                  </span>
                </div>
              </section>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
