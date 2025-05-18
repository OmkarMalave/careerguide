const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a career title'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  educationRequirements: {
    type: String,
    required: true
  },
  averageSalary: {
    type: String,
    required: true
  },
  jobOutlook: {
    type: String,
    required: true
  },
  careerTraits: {
    type: Map,
    of: Number,
    required: true
  },
  books: [{
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true }
  }],
  courses: [{
    title: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    isOnline: { type: Boolean, required: true },
    link: { type: String, required: true }
  }],
  colleges: [{
    name: { type: String, required: true },
    location: { type: String, required: true },
    programs: [{ type: String }],
    description: { type: String, required: true },
    link: { type: String, required: false, default: '#' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Drop any existing indexes
CareerSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model('Career', CareerSchema); 