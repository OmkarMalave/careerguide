const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedOption: {
      type: Number,
      required: true
    }
  }],
  scores: {
    type: Map,
    of: Number,
    default: {}
  },
  recommendedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestResult', TestResultSchema); 