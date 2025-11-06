// ============================================================================
// Jest Unit Tests for API Endpoints
// ============================================================================

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const DataModel = require('../models/dataModel');

// Test data - Census Block format
const testBlock = {
  geoid: '110010999991000',
  block: '1000',
  tract: '999900',
  totalPopulation: 500,
  hispanicPopulation: 100,
  adultPopulation: 380,
  housing: {
    totalUnits: 200,
    occupiedUnits: 190,
    vacantUnits: 10
  },
  geography: {
    landArea: 50000,
    waterArea: 0
  }
};

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hw2db_test';
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  // Clean up and close connection
  await DataModel.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear data before each test
  await DataModel.deleteMany({});
});

// ============================================================================
// CRUD OPERATION TESTS
// ============================================================================

describe('CRUD Operations', () => {

  // CREATE Tests
  describe('POST /api/data', () => {
    test('Should create a new census block entry', async () => {
      const response = await request(app)
        .post('/api/data')
        .send(testBlock)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.geoid).toBe(testBlock.geoid);
      expect(response.body.data.totalPopulation).toBe(testBlock.totalPopulation);
    });

    test('Should fail to create entry without required fields', async () => {
      const invalidBlock = { block: '9999' };

      const response = await request(app)
        .post('/api/data')
        .send(invalidBlock)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // READ Tests
  describe('GET /api/data', () => {
    test('Should get all census block entries', async () => {
      // Insert test data
      await DataModel.create(testBlock);

      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Should return empty array when no data exists', async () => {
      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/data/:id', () => {
    test('Should get a census block by ID', async () => {
      const created = await DataModel.create(testBlock);

      const response = await request(app)
        .get(`/api/data/${created._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.geoid).toBe(testBlock.geoid);
    });

    test('Should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/data/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // UPDATE Tests
  describe('PUT /api/data/:id', () => {
    test('Should update a census block entry', async () => {
      const created = await DataModel.create(testBlock);
      const updatedData = { totalPopulation: 600, hispanicPopulation: 120 };

      const response = await request(app)
        .put(`/api/data/${created._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalPopulation).toBe(600);
      expect(response.body.data.hispanicPopulation).toBe(120);
    });

    test('Should return 404 when updating non-existent entry', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/data/${fakeId}`)
        .send({ totalPopulation: 999 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // DELETE Tests
  describe('DELETE /api/data/:id', () => {
    test('Should delete a census block entry', async () => {
      const created = await DataModel.create(testBlock);

      const response = await request(app)
        .delete(`/api/data/${created._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const found = await DataModel.findById(created._id);
      expect(found).toBeNull();
    });

    test('Should return 404 when deleting non-existent entry', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/data/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

// ============================================================================
// QUESTION ENDPOINT TESTS
// ============================================================================

describe('Question Endpoints', () => {

  beforeEach(async () => {
    // Insert multiple census blocks for question tests
    await DataModel.insertMany([
      {
        geoid: '110010001001000',
        block: '1000',
        tract: '000100',
        totalPopulation: 300,
        hispanicPopulation: 60,
        adultPopulation: 230,
        housing: { totalUnits: 120, occupiedUnits: 100, vacantUnits: 20 },
        geography: { landArea: 30000, waterArea: 0 }
      },
      {
        geoid: '110010001001001',
        block: '1001',
        tract: '000100',
        totalPopulation: 500,
        hispanicPopulation: 100,
        adultPopulation: 380,
        housing: { totalUnits: 200, occupiedUnits: 180, vacantUnits: 20 },
        geography: { landArea: 40000, waterArea: 0 }
      },
      {
        geoid: '110010002002000',
        block: '2000',
        tract: '000200',
        totalPopulation: 0,
        hispanicPopulation: 0,
        adultPopulation: 0,
        housing: { totalUnits: 50, occupiedUnits: 0, vacantUnits: 50 },
        geography: { landArea: 50000, waterArea: 5000 }
      }
    ]);
  });

  // Question 1: Total Population
  describe('GET /api/questions/1', () => {
    test('Should return total population across all census blocks', async () => {
      const response = await request(app)
        .get('/api/questions/1')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toBe('800'); // API returns formatted string
    });
  });

  // Question 2: Average Population
  describe('GET /api/questions/2', () => {
    test('Should return average population per census block', async () => {
      const response = await request(app)
        .get('/api/questions/2')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toBe('267'); // API returns formatted string
    });
  });

  // Question 3: Highest Population Density
  describe('GET /api/questions/3', () => {
    test('Should return census block with highest population density', async () => {
      const response = await request(app)
        .get('/api/questions/3')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toContain('110010001001001'); // API returns formatted string
    });
  });

  // Question 4: Vacancy Percentage
  describe('GET /api/questions/4', () => {
    test('Should return overall housing vacancy percentage', async () => {
      const response = await request(app)
        .get('/api/questions/4')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toBe('24.32%'); // API returns formatted string
    });
  });

  // Question 5: Tract with Most Housing Units
  describe('GET /api/questions/5', () => {
    test('Should return tract with most housing units', async () => {
      const response = await request(app)
        .get('/api/questions/5')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toContain('000100'); // API returns formatted string
    });
  });

  // Question 6: Median Land Area
  describe('GET /api/questions/6', () => {
    test('Should return median land area of all census blocks', async () => {
      const response = await request(app)
        .get('/api/questions/6')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toContain('40,000'); // API returns formatted string
    });
  });

  // Question 7: Count of Zero Population Blocks
  describe('GET /api/questions/7', () => {
    test('Should return count of census blocks with zero population', async () => {
      const response = await request(app)
        .get('/api/questions/7')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toBe('1'); // API returns formatted string
    });
  });

  // Question 8: Hispanic Population Ratio
  describe('GET /api/questions/8', () => {
    test('Should return Hispanic population ratio', async () => {
      const response = await request(app)
        .get('/api/questions/8')
        .expect(200);

      expect(response.body.question).toBeDefined();
      expect(response.body.answer).toBe('0.2000'); // API returns formatted string
    });
  });
});

// ============================================================================
// ROOT ENDPOINT TEST
// ============================================================================

describe('Root Endpoint', () => {
  test('GET / should return API documentation', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body.message).toContain('Welcome');
    expect(response.body.endpoints).toBeDefined();
  });
});
