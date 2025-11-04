// /server/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js'; // Assuming Category model location
import categoriesData from './data/categories.js'; // Import the new data file
import connectDB from './config/db.js'; // Assuming your DB connection utility

dotenv.config();

connectDB(); // Establish the database connection

// --- Function to Import Data ---
const importData = async () => {
  try {
    // 1. Clear existing data to prevent duplicates
    await Category.deleteMany();
    
    // 2. Insert the new data
    await Category.insertMany(categoriesData);

    console.log('✅ Data Imported! Categories seeded successfully.');
    process.exit();
  } catch (error) {
    console.error(`🛑 Error during data import: ${error.message}`);
    process.exit(1);
  }
};

// --- Function to Destroy Data (Cleanup) ---
const destroyData = async () => {
  try {
    await Category.deleteMany();
    
    console.log('🗑️ Data Destroyed! All categories removed.');
    process.exit();
  } catch (error) {
    console.error(`🛑 Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to decide whether to import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}