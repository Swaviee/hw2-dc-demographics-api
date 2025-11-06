// ============================================================================
// Data Controller - CRUD Operations and Question Endpoints
// HW2 Continuation of HW1: DC Demographics Analysis
// Henry Faya - 5083025
// ============================================================================

const CensusBlock = require('../models/dataModel');

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * GET all census blocks
 */
exports.getAllData = async (req, res) => {
  try {
    const data = await CensusBlock.find();
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET census block by ID
 */
exports.getDataById = async (req, res) => {
  try {
    const data = await CensusBlock.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Census block not found'
      });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * POST - Create new census block
 */
exports.createData = async (req, res) => {
  try {
    const newData = await CensusBlock.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Census block created successfully',
      data: newData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * PUT - Update census block by ID
 */
exports.updateData = async (req, res) => {
  try {
    const updatedData = await CensusBlock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,  // Return updated document
        runValidators: true  // Run schema validators
      }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        error: 'Census block not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Census block updated successfully',
      data: updatedData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * DELETE - Delete census block by ID
 */
exports.deleteData = async (req, res) => {
  try {
    const deletedData = await CensusBlock.findByIdAndDelete(req.params.id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        error: 'Census block not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Census block deleted successfully',
      data: deletedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================================================
// QUESTION ENDPOINTS (8 Questions from HW1)
// These implement the same analysis as index_henry_faya.js
// ============================================================================

/**
 * Question 1: What is the total population across all census blocks?
 */
exports.question1 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
      {
        $group: {
          _id: null,
          totalPopulation: { $sum: '$totalPopulation' },
          blockCount: { $sum: 1 }
        }
      }
    ]);

    const totalPop = result.length > 0 ? result[0].totalPopulation : 0;
    const blockCount = result.length > 0 ? result[0].blockCount : 0;

    res.status(200).json({
      question: 'What is the total population across all census blocks?',
      answer: totalPop.toLocaleString(),
      details: {
        totalPopulation: totalPop,
        censusBlocksAnalyzed: blockCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 2: What is the average population per census block?
 */
exports.question2 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
      {
        $group: {
          _id: null,
          avgPopulation: { $avg: '$totalPopulation' },
          totalBlocks: { $sum: 1 }
        }
      }
    ]);

    const avgPop = result.length > 0 ? Math.round(result[0].avgPopulation) : 0;
    const totalBlocks = result.length > 0 ? result[0].totalBlocks : 0;

    res.status(200).json({
      question: 'What is the average population per census block?',
      answer: avgPop.toLocaleString(),
      details: {
        averagePopulation: avgPop,
        totalCensusBlocks: totalBlocks
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 3: Which census block has the highest population density?
 */
exports.question3 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
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
        $limit: 1
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        question: 'Which census block has the highest population density?',
        answer: 'No data available',
        details: null
      });
    }

    const densestBlock = result[0];
    const answerText = `Block ${densestBlock.geoid} with ${Math.round(densestBlock.density).toLocaleString()} people per sq km`;

    res.status(200).json({
      question: 'Which census block has the highest population density?',
      answer: answerText,
      details: {
        geoid: densestBlock.geoid,
        block: densestBlock.block,
        tract: densestBlock.tract,
        population: densestBlock.totalPopulation,
        landArea: densestBlock.geography.landArea,
        density: Math.round(densestBlock.density)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 4: What percentage of housing units are vacant citywide?
 */
exports.question4 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$housing.totalUnits' },
          vacantUnits: { $sum: '$housing.vacantUnits' }
        }
      }
    ]);

    if (result.length === 0 || result[0].totalUnits === 0) {
      return res.status(200).json({
        question: 'What percentage of housing units are vacant citywide?',
        answer: '0.00%',
        details: {
          vacancyPercentage: 0,
          totalUnits: 0,
          vacantUnits: 0
        }
      });
    }

    const totalUnits = result[0].totalUnits;
    const vacantUnits = result[0].vacantUnits;
    const vacancyPct = (vacantUnits / totalUnits) * 100;

    res.status(200).json({
      question: 'What percentage of housing units are vacant citywide?',
      answer: `${vacancyPct.toFixed(2)}%`,
      details: {
        vacancyPercentage: parseFloat(vacancyPct.toFixed(2)),
        totalUnits: totalUnits,
        vacantUnits: vacantUnits,
        occupiedUnits: totalUnits - vacantUnits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 5: Which tract has the most total housing units?
 */
exports.question5 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
      {
        $group: {
          _id: '$tract',
          totalHousing: { $sum: '$housing.totalUnits' },
          blockCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalHousing: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        question: 'Which tract has the most total housing units?',
        answer: 'No data available',
        details: null
      });
    }

    const topTract = result[0];
    const answerText = `Tract ${topTract._id} with ${topTract.totalHousing.toLocaleString()} units`;

    res.status(200).json({
      question: 'Which tract has the most total housing units?',
      answer: answerText,
      details: {
        tract: topTract._id,
        totalHousingUnits: topTract.totalHousing,
        censusBlocksInTract: topTract.blockCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 6: What is the median land area of census blocks?
 */
exports.question6 = async (req, res) => {
  try {
    // Get all land areas, sorted
    const blocks = await CensusBlock.find({ 'geography.landArea': { $gt: 0 } })
      .select('geography.landArea')
      .sort({ 'geography.landArea': 1 });

    if (blocks.length === 0) {
      return res.status(200).json({
        question: 'What is the median land area of census blocks?',
        answer: '0 square meters',
        details: {
          medianLandArea: 0,
          blocksWithLandArea: 0
        }
      });
    }

    const landAreas = blocks.map(b => b.geography.landArea);
    const midIndex = Math.floor(landAreas.length / 2);
    const medianArea = landAreas.length % 2 === 0
      ? (landAreas[midIndex - 1] + landAreas[midIndex]) / 2
      : landAreas[midIndex];

    res.status(200).json({
      question: 'What is the median land area of census blocks?',
      answer: `${medianArea.toLocaleString()} square meters`,
      details: {
        medianLandArea: medianArea,
        blocksWithLandArea: landAreas.length,
        minLandArea: landAreas[0],
        maxLandArea: landAreas[landAreas.length - 1]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 7: How many census blocks have zero population?
 */
exports.question7 = async (req, res) => {
  try {
    const count = await CensusBlock.countDocuments({ totalPopulation: 0 });

    // Get details of zero-population blocks
    const zeroPopBlocks = await CensusBlock.find({ totalPopulation: 0 })
      .select('geoid block tract geography.landArea')
      .limit(10);  // Limit to first 10 for response size

    res.status(200).json({
      question: 'How many census blocks have zero population?',
      answer: count.toLocaleString(),
      details: {
        zeroPopulationBlocks: count,
        sampleBlocks: zeroPopBlocks.map(b => ({
          geoid: b.geoid,
          block: b.block,
          tract: b.tract,
          landArea: b.geography.landArea
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Question 8: What is the ratio of Hispanic to total population across all blocks?
 */
exports.question8 = async (req, res) => {
  try {
    const result = await CensusBlock.aggregate([
      {
        $group: {
          _id: null,
          totalPopulation: { $sum: '$totalPopulation' },
          hispanicPopulation: { $sum: '$hispanicPopulation' }
        }
      }
    ]);

    if (result.length === 0 || result[0].totalPopulation === 0) {
      return res.status(200).json({
        question: 'What is the ratio of Hispanic to total population across all blocks?',
        answer: '0.0000',
        details: {
          ratio: 0,
          percentage: 0,
          totalPopulation: 0,
          hispanicPopulation: 0
        }
      });
    }

    const totalPop = result[0].totalPopulation;
    const hispanicPop = result[0].hispanicPopulation;
    const ratio = hispanicPop / totalPop;
    const percentage = ratio * 100;

    res.status(200).json({
      question: 'What is the ratio of Hispanic to total population across all blocks?',
      answer: ratio.toFixed(4),
      details: {
        ratio: parseFloat(ratio.toFixed(4)),
        percentage: parseFloat(percentage.toFixed(2)),
        totalPopulation: totalPop,
        hispanicPopulation: hispanicPop
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
