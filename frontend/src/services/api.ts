import axios from 'axios';
import { Note } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const noteService = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
  },

  // Get note by ID
  getNoteById: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create new note
  createNote: async (note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  // Update note
  updateNote: async (id: string, note: Partial<Note>): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;