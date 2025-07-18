const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 50000 // Allow for large LaTeX documents
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: 'anonymous' // For demo purposes
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Index for better query performance
noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted creation date
noteSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to get excerpt of content
noteSchema.methods.getExcerpt = function(length = 100) {
  return this.content.length > length 
    ? this.content.substring(0, length) + '...'
    : this.content;
};

// Static method to find notes by user
noteSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ updatedAt: -1 });
};

// Pre-save middleware to validate content
noteSchema.pre('save', function(next) {
  if (this.content.length > 50000) {
    next(new Error('Content exceeds maximum length'));
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);