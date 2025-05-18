const mongoose = require('mongoose');
const dotenv = require('dotenv');
const careers = require('./careers');
const Career = require('../models/Career');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career-stop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Drop all indexes
const dropIndexes = async () => {
  try {
    await Career.collection.dropIndexes();
    console.log('Indexes dropped');
  } catch (err) {
    console.log('No indexes to drop or error dropping indexes:', err.message);
  }
};

// Delete all careers
const deleteCareers = async () => {
  try {
    await Career.deleteMany({});
    console.log('Careers deleted');
  } catch (err) {
    console.error('Error deleting careers:', err);
    process.exit(1);
  }
};

// Import careers
const importCareers = async () => {
  try {
    // Insert one career at a time to better handle errors
    for (const career of careers) {
      try {
        await Career.create(career);
        console.log(`Career "${career.title}" imported successfully`);
      } catch (err) {
        console.error(`Error importing career "${career.title}":`, err.message);
      }
    }
    console.log('Career import completed');
    process.exit(0);
  } catch (err) {
    console.error('Error in import process:', err);
    process.exit(1);
  }
};

// Run the seed
const seed = async () => {
  try {
    await dropIndexes();
    await deleteCareers();
    await importCareers();
  } catch (err) {
    console.error('Error in seed process:', err);
    process.exit(1);
  }
};

seed(); 