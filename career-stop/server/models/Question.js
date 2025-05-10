const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please provide a question text'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['interests', 'skills', 'personality', 'values'],
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Please provide an option text'],
      trim: true
    },
    score: {
      type: Map,
      of: Number,
      default: {}
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema); 