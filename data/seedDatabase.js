// ============================================================================
// Database Seeding Script
// Run this to populate MongoDB with sample DC Census Block data
// Henry Faya - 5083025
// ============================================================================

const mongoose = require('mongoose');
const CensusBlock = require('../models/dataModel');
const sampleData = require('./sampleData.json');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dc_demographics';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  return seedDatabase();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Clear existing data
    await CensusBlock.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert sample data
    const result = await CensusBlock.insertMany(sampleData);
    console.log(`✅ Successfully inserted ${result.length} census blocks`);

    // Display inserted data
    console.log('\n📊 Inserted Census Blocks:');
    result.forEach((block, index) => {
      console.log(`${index + 1}. ${block.geoid} (Tract ${block.tract}) - Population: ${block.totalPopulation.toLocaleString()}`);
    });

    // Calculate and display statistics
    const totalPop = result.reduce((sum, block) => sum + block.totalPopulation, 0);
    const totalHousing = result.reduce((sum, block) => sum + block.housing.totalUnits, 0);
    const zeroPopBlocks = result.filter(block => block.totalPopulation === 0).length;

    console.log('\n📈 Database Statistics:');
    console.log(`Total census blocks: ${result.length}`);
    console.log(`Total population: ${totalPop.toLocaleString()}`);
    console.log(`Total housing units: ${totalHousing.toLocaleString()}`);
    console.log(`Blocks with zero population: ${zeroPopBlocks}`);

    // Verify insertion
    const count = await CensusBlock.countDocuments();
    console.log(`\n✅ Verified: ${count} documents in database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}
