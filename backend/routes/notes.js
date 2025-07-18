const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// Helper function to use memory storage when MongoDB is not available
const getStorage = (req) => {
  if (req.app.locals.usingMemoryStorage) {
    return {
      notes: req.app.locals.memoryNotes,
      counter: () => req.app.locals.noteIdCounter++
    };
  }
  return null;
};

// GET /api/notes - Get all notes
router.get('/', async (req, res) => {
  try {
    const storage = getStorage(req);
    
    if (storage) {
      // Memory storage implementation
      let notes = [...storage.notes];
      const { search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
      
      if (search) {
        notes = notes.filter(note => 
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      notes.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const order = sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : aVal < bVal ? -order : 0;
      });
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedNotes = notes.slice(startIndex, endIndex);
      
      return res.json({
        notes: paginatedNotes,
        totalPages: Math.ceil(notes.length / limit),
        currentPage: page,
        totalNotes: notes.length
      });
    }
    
    const { page = 1, limit = 10, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    const query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notes = await Note.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// GET /api/notes/:id - Get a specific note
router.get('/:id', async (req, res) => {
  try {
    const storage = getStorage(req);
    
    if (storage) {
      const note = storage.notes.find(n => n._id === req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      return res.json(note);
    }
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const storage = getStorage(req);
    
    if (storage) {
      const newNote = {
        _id: storage.counter().toString(),
        title: req.body.title || 'Untitled',
        content: req.body.content || '',
        tags: req.body.tags || [],
        isPublic: req.body.isPublic || false,
        userId: req.body.userId || 'anonymous',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      storage.notes.push(newNote);
      return res.status(201).json(newNote);
    }
    
    const { title, content, tags, isPublic } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      isPublic: isPublic || false,
      userId: 'anonymous' // For demo purposes
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const storage = getStorage(req);
    
    if (storage) {
      const noteIndex = storage.notes.findIndex(n => n._id === req.params.id);
      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      const updatedNote = {
        ...storage.notes[noteIndex],
        ...req.body,
        updatedAt: new Date()
      };
      
      storage.notes[noteIndex] = updatedNote;
      return res.json(updatedNote);
    }
    
    const { title, content, tags, isPublic } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        content, 
        tags: tags || [], 
        isPublic: isPublic || false 
      },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const storage = getStorage(req);
    
    if (storage) {
      const noteIndex = storage.notes.findIndex(n => n._id === req.params.id);
      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      storage.notes.splice(noteIndex, 1);
      return res.json({ message: 'Note deleted successfully' });
    }
    
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

// GET /api/notes/search/:query - Search notes
router.get('/search/:query', async (req, res) => {
  try {
    const storage = getStorage(req);
    
    if (storage) {
      const query = req.params.query.toLowerCase();
      const results = storage.notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
      
      return res.json(results);
    }
    
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ message: 'Error searching notes', error: error.message });
  }
});

module.exports = router;