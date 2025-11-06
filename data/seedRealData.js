// ============================================================================
// Load REAL HW1 Data into MongoDB
// This loads the actual 1000 DC Census Blocks from HW1
// Henry Faya - 5083025
// ============================================================================

const mongoose = require('mongoose');
const CensusBlock = require('../models/dataModel');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dc_demographics';

// Load the real data from HW1
const realDataPath = path.join(__dirname, '../../processed-demographic-data.json');
console.log('Loading data from:', realDataPath);

let realData;
try {
  const fileContent = fs.readFileSync(realDataPath, 'utf8');
  realData = JSON.parse(fileContent);
  console.log(`✅ Loaded ${realData.length} census blocks from HW1`);
} catch (error) {
  console.error('❌ Error reading HW1 data file:', error);
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  return seedDatabase();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Clear existing data
    const deleteResult = await CensusBlock.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing documents`);

    // Insert real HW1 data
    console.log('📤 Inserting 1000 census blocks...');
    const result = await CensusBlock.insertMany(realData);
    console.log(`✅ Successfully inserted ${result.length} census blocks`);

    // Calculate and display statistics
    const totalPop = result.reduce((sum, block) => sum + block.totalPopulation, 0);
    const totalHousing = result.reduce((sum, block) => sum + block.housing.totalUnits, 0);
    const occupiedUnits = result.reduce((sum, block) => sum + block.housing.occupiedUnits, 0);
    const vacantUnits = result.reduce((sum, block) => sum + block.housing.vacantUnits, 0);
    const zeroPopBlocks = result.filter(block => block.totalPopulation === 0).length;
    const hispanicPop = result.reduce((sum, block) => sum + block.hispanicPopulation, 0);

    console.log('\n📈 Database Statistics (Real HW1 Data):');
    console.log(`Total census blocks: ${result.length.toLocaleString()}`);
    console.log(`Total population: ${totalPop.toLocaleString()}`);
    console.log(`Average population per block: ${Math.round(totalPop / result.length)}`);
    console.log(`Total housing units: ${totalHousing.toLocaleString()}`);
    console.log(`Occupied units: ${occupiedUnits.toLocaleString()}`);
    console.log(`Vacant units: ${vacantUnits.toLocaleString()}`);
    console.log(`Vacancy rate: ${((vacantUnits / totalHousing) * 100).toFixed(2)}%`);
    console.log(`Blocks with zero population: ${zeroPopBlocks}`);
    console.log(`Hispanic population: ${hispanicPop.toLocaleString()}`);
    console.log(`Hispanic ratio: ${(hispanicPop / totalPop).toFixed(4)}`);

    // Verify insertion
    const count = await CensusBlock.countDocuments();
    console.log(`\n✅ Verified: ${count.toLocaleString()} documents in database`);

    console.log('\n🎉 Real HW1 data successfully loaded!');
    console.log('Your API will now return the same answers as HW1!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error - some census blocks already exist');
    }
    process.exit(1);
  }
}
