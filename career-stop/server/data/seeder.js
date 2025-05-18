const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Question = require('../models/Question');
const questions = require('./questions');

// Load env vars
dotenv.config();

// Connect to DB
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career-stop';
console.log('Attempting to connect to MongoDB with URI:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected for seeding...'.green);
  })
  .catch((err) => {
    console.error('MongoDB connection error:'.red, err);
    process.exit(1);
  });

// Import Data
const importData = async () => {
  try {
    // Clear existing questions
    await Question.deleteMany();
    
    // Insert questions
    await Question.insertMany(questions);
    
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete Data
const destroyData = async () => {
  try {
    await Question.deleteMany();
    
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 