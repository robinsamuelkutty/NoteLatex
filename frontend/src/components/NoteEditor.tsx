import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toast';
import Editor from './Editor';
import Preview from './Preview';
import Toolbar from './Toolbar';
import NotesList from './NotesList';
import { Note } from '../types';
import { noteService } from '../services/api';

const NoteEditor: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    loadNotes();
  }, []);

const loadNotes = async () => {
  try {
    setLoading(true);
    const fetchedNotes = await noteService.getAllNotes();
    console.log("fetchNOtes",fetchedNotes)
    // Safely set only if it's an array
    if (Array.isArray(fetchedNotes)) {
      setNotes(fetchedNotes);
    } else if (fetchedNotes && Array.isArray(fetchedNotes)) {
      setNotes(fetchedNotes);
    } else {
      console.error('Invalid notes format:', fetchedNotes);
      setNotes([]); // fallback to empty
    }
  } catch (error) {
    console.error('Error loading notes:', error);
    setNotes([]); // fallback on error
  } finally {
    setLoading(false);
  }
};

  const handleSymbolClick = (latex: string) => {
    // Insert the LaTeX at the current cursor position
    const newContent = content + latex;
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    try {
      setLoading(true);
      const noteData = {
        title: title.trim(),
        content: content.trim(),
      };

      if (currentNote?._id) {
        // Update existing note
        const updatedNote = await noteService.updateNote(currentNote._id, noteData);
        setNotes(notes.map(note => 
          note._id === currentNote._id ? updatedNote : note
        ));
        setCurrentNote(updatedNote);
      } else {
        // Create new note
        const newNote = await noteService.createNote(noteData);
        setNotes([newNote, ...notes]);
        setCurrentNote(newNote);
      }
      
      alert('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
  };

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowNotes(false);
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      setLoading(true);
      await noteService.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
      
      if (currentNote?._id === id) {
        handleNewNote();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar
        onSymbolClick={handleSymbolClick}
        onSave={handleSave}
        onNewNote={handleNewNote}
        onShowNotes={() => setShowNotes(true)}
      />
      
      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-200">
          <Editor
            ref={editorRef}
            value={content}
            onChange={setContent}
            title={title}
            onTitleChange={setTitle}
          />
        </div>
        
        <div className="w-1/2">
          <Preview content={content} title={title} />
        </div>
      </div>

      {showNotes && (
        <NotesList
          notes={notes}
          onSelectNote={handleSelectNote}
          onDeleteNote={handleDeleteNote}
          onClose={() => setShowNotes(false)}
        />
      )}
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;