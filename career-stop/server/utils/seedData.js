const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('../models/Career');
const Question = require('../models/Question');
const careers = require('../data/careers');

// Load env vars
dotenv.config();

// Connect to DB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/career_stop';
console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    return importData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import data
const importData = async () => {
  try {
    console.log('Starting data import...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Career.deleteMany();
    await Question.deleteMany();
    console.log('Existing data cleared successfully');

    // Keep track of titles to handle duplicates
    const titleCount = new Map();

    // Transform career data to match server model
    console.log('Transforming career data...');
    const transformedCareers = careers.map(career => {
      // Handle duplicate titles
      const baseTitle = career.title;
      const count = titleCount.get(baseTitle) || 0;
      titleCount.set(baseTitle, count + 1);
      
      const title = count === 0 ? baseTitle : `${baseTitle} (${count + 1})`;
      
      // Transform books to match schema
      const books = career.books.map(book => ({
        title: book.title || 'Unknown Book',
        author: book.author || 'Unknown Author',
        description: book.description || `A comprehensive guide to ${book.title || 'the subject'}`,
        link: book.link || `https://www.amazon.com/s?k=${encodeURIComponent(book.title || 'Unknown Book')}`
      }));

      // Transform courses to match schema
      const courses = career.courses.map(course => ({
        title: course.title || 'Unknown Course',
        provider: course.provider || 'Unknown Provider',
        description: course.description || `Learn ${course.title || 'the subject'} in detail`,
        duration: course.duration || 'Self-paced',
        isOnline: course.isOnline !== undefined ? course.isOnline : true,
        link: course.link || `https://www.coursera.org/search?query=${encodeURIComponent(course.title || 'Unknown Course')}`
      }));

      // Transform colleges to match schema
      const colleges = career.colleges.map(college => ({
        name: college.name || 'Unknown College',
        location: college.location || 'India',
        programs: college.programs || ['Bachelor\'s Degree', 'Master\'s Degree'],
        description: college.description || `Top institution for ${career.title} education`,
        link: college.link || `https://www.google.com/search?q=${encodeURIComponent(college.name || 'Unknown College')}`
      }));

      return {
        title: title,
        description: career.description,
        skills: career.skills || [],
        educationRequirements: career.educationRequirements || 'Bachelor\'s degree',
        averageSalary: career.averageSalary || '₹6,00,000 - ₹12,00,000 per annum',
        jobOutlook: career.jobOutlook || 'Growing',
        careerTraits: new Map(Object.entries(career.careerTraits || {
          technical: 7,
          analytical: 7,
          creative: 7,
          communication: 7,
          leadership: 7,
          detailOriented: 7
        })),
        books,
        courses,
        colleges,
        createdAt: new Date()
      };
    });

    // Insert transformed careers
    console.log('Inserting careers into database...');
    const result = await Career.insertMany(transformedCareers);
    console.log(`Successfully imported ${result.length} careers`);

    console.log('Data Import Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  console.log('Starting seeding process...');
  // The actual seeding will be triggered by the mongoose.connect() promise
}

module.exports = { importData };