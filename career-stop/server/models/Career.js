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
    trim: true
  },
  averageSalary: {
    type: String,
    trim: true
  },
  jobOutlook: {
    type: String,
    trim: true
  },
  careerTraits: {
    type: Map,
    of: Number,
    default: {}
  },
  books: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  courses: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    provider: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isOnline: {
      type: Boolean,
      default: true
    }
  }],
  colleges: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    programs: [{
      type: String,
      trim: true
    }],
    link: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  articles: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    publishedDate: {
      type: Date
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Career', CareerSchema); 