const mongoose = require('mongoose');
const Question = require('../models/Question');
const questions = require('./questions');
require('dotenv').config();

const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Delete existing questions
    await Question.deleteMany({});
    console.log('Deleted existing questions');

    // Insert new questions
    await Question.insertMany(questions);
    console.log('Inserted new questions');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions(); 