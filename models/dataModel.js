// ============================================================================
// Data Model (Mongoose Schema) - DC Census Blocks
// Continuation of HW1: DC Demographics API
// ============================================================================

const mongoose = require('mongoose');

// Housing sub-schema
const housingSchema = new mongoose.Schema({
  totalUnits: {
    type: Number,
    default: 0,
    min: [0, 'Total units must be non-negative'],
    comment: 'H0010001 - Total housing units'
  },
  occupiedUnits: {
    type: Number,
    default: 0,
    min: [0, 'Occupied units must be non-negative'],
    comment: 'H0010002 - Occupied housing units'
  },
  vacantUnits: {
    type: Number,
    default: 0,
    min: [0, 'Vacant units must be non-negative'],
    comment: 'H0010003 - Vacant housing units'
  }
}, { _id: false });

// Geography sub-schema
const geographySchema = new mongoose.Schema({
  landArea: {
    type: Number,
    default: 0,
    min: [0, 'Land area must be non-negative'],
    comment: 'ALAND - Land area in square meters'
  },
  waterArea: {
    type: Number,
    default: 0,
    min: [0, 'Water area must be non-negative'],
    comment: 'AWATER - Water area in square meters'
  }
}, { _id: false });

// Main DC Census Block schema
const censusBlockSchema = new mongoose.Schema({
  geoid: {
    type: String,
    required: [true, 'GEOID is required'],
    unique: true,
    trim: true,
    comment: 'Geographic identifier for census block'
  },
  block: {
    type: String,
    required: [true, 'Block number is required'],
    trim: true
  },
  tract: {
    type: String,
    required: [true, 'Tract number is required'],
    trim: true,
    index: true
  },
  totalPopulation: {
    type: Number,
    required: [true, 'Total population is required'],
    default: 0,
    min: [0, 'Population must be non-negative'],
    comment: 'P0010001 - Total population'
  },
  hispanicPopulation: {
    type: Number,
    default: 0,
    min: [0, 'Hispanic population must be non-negative'],
    comment: 'P0020002 - Hispanic or Latino population'
  },
  adultPopulation: {
    type: Number,
    default: 0,
    min: [0, 'Adult population must be non-negative'],
    comment: 'P0030001 - Population 18 years and over'
  },
  housing: {
    type: housingSchema,
    required: true
  },
  geography: {
    type: geographySchema,
    required: true
  }
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt fields
  collection: 'censusBlocks'  // Collection name in MongoDB
});

// Add indexes for better query performance
censusBlockSchema.index({ geoid: 1 });
censusBlockSchema.index({ tract: 1 });
censusBlockSchema.index({ totalPopulation: -1 });
censusBlockSchema.index({ 'geography.landArea': 1 });

// Instance methods
censusBlockSchema.methods.calculatePopulationDensity = function() {
  if (this.geography.landArea > 0) {
    // Density per square kilometer
    return this.totalPopulation / (this.geography.landArea / 1000000);
  }
  return 0;
};

censusBlockSchema.methods.calculateVacancyRate = function() {
  if (this.housing.totalUnits > 0) {
    return (this.housing.vacantUnits / this.housing.totalUnits) * 100;
  }
  return 0;
};

censusBlockSchema.methods.calculateHispanicPercentage = function() {
  if (this.totalPopulation > 0) {
    return (this.hispanicPopulation / this.totalPopulation) * 100;
  }
  return 0;
};

// Static methods
censusBlockSchema.statics.findByTract = function(tract) {
  return this.find({ tract: tract });
};

censusBlockSchema.statics.findZeroPopulation = function() {
  return this.find({ totalPopulation: 0 });
};

censusBlockSchema.statics.findHighestDensity = function(limit = 1) {
  return this.aggregate([
    {
      $match: { 'geography.landArea': { $gt: 0 } }
    },
    {
      $addFields: {
        density: {
          $divide: ['$totalPopulation', { $divide: ['$geography.landArea', 1000000] }]
        }
      }
    },
    {
      $sort: { density: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

// Virtual properties
censusBlockSchema.virtual('hasPopulation').get(function() {
  return this.totalPopulation > 0;
});

censusBlockSchema.virtual('occupancyRate').get(function() {
  if (this.housing.totalUnits > 0) {
    return (this.housing.occupiedUnits / this.housing.totalUnits) * 100;
  }
  return 0;
});

// Ensure virtuals are included in JSON output
censusBlockSchema.set('toJSON', { virtuals: true });
censusBlockSchema.set('toObject', { virtuals: true });

// Create and export the model
const CensusBlock = mongoose.model('CensusBlock', censusBlockSchema);

module.exports = CensusBlock;
