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
      enum: ['interests', 'personality', 'skills', 'values'],
      required: true
    }
  }],
  scores: {
    interests: {
      analytical: { type: Number, min: 0, max: 10 },
      creative: { type: Number, min: 0, max: 10 },
      social: { type: Number, min: 0, max: 10 }
    },
    personality: {
      structured: { type: Number, min: 0, max: 10 },
      independent: { type: Number, min: 0, max: 10 },
      teamwork: { type: Number, min: 0, max: 10 }
    },
    skills: {
      technical: { type: Number, min: 0, max: 10 },
      communication: { type: Number, min: 0, max: 10 },
      creative: { type: Number, min: 0, max: 10 }
    },
    values: {
      security: { type: Number, min: 0, max: 10 },
      growth: { type: Number, min: 0, max: 10 },
      balance: { type: Number, min: 0, max: 10 }
    }
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