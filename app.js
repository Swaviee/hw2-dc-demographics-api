// ============================================================================
// HW2: RESTful API with Node.js, Express, and MongoDB
// Main Application File
// ============================================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const apiRoutes = require('./routes/api');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dc_demographics';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DC Demographics RESTful API - HW2',
    description: 'Continuation of HW1: DC Census Blocks 2020 Analysis',
    author: 'Henry Faya',
    studentId: '5083025',
    version: '1.0.0',
    dataSource: 'DC Open Data - Census Blocks 2020',
    endpoints: {
      crud: {
        'GET /api/data': 'Get all census blocks',
        'GET /api/data/:id': 'Get census block by ID',
        'POST /api/data': 'Create new census block',
        'PUT /api/data/:id': 'Update census block by ID',
        'DELETE /api/data/:id': 'Delete census block by ID'
      },
      questions: {
        'GET /api/questions/1': 'What is the total population across all census blocks?',
        'GET /api/questions/2': 'What is the average population per census block?',
        'GET /api/questions/3': 'Which census block has the highest population density?',
        'GET /api/questions/4': 'What percentage of housing units are vacant citywide?',
        'GET /api/questions/5': 'Which tract has the most total housing units?',
        'GET /api/questions/6': 'What is the median land area of census blocks?',
        'GET /api/questions/7': 'How many census blocks have zero population?',
        'GET /api/questions/8': 'What is the ratio of Hispanic to total population across all blocks?'
      }
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API documentation available at http://localhost:${PORT}`);
  });
}

// Export for testing
module.exports = app;
