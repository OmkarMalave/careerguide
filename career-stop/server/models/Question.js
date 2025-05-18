const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Question category is required'],
    enum: ['personality', 'interests', 'skills', 'values', 'workStyle']
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Option text is required']
    },
    score: {
      type: Number,
      required: [true, 'Option score is required'],
      min: 1,
      max: 5
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema); 