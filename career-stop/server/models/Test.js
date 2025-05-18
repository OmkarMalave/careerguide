const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ['interests', 'personality', 'skills', 'values', 'workStyle'],
      required: true
    }
  }],
  scores: {
    totalUserScore: { type: Number, required: true },
    numberOfQuestionsAnswered: { type: Number, required: true },
    userPercentageScore: { type: Number, required: true }
  },
  educationLevel: {
    type: String,
    required: true,
    enum: ['10th', '12th', 'Graduate']
  },
  recommendedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Test', TestSchema); 