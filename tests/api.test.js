// ============================================================================
// Jest Unit Tests for API Endpoints
// ============================================================================

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const DataModel = require('../models/dataModel');

// Test data
const testCity = {
  city: 'Test City',
  population: 500000,
  growthRate: 3.0,
  density: 2000,
  averageAge: 32.5,
  country: 'USA',
  region: 'Test Region'
};

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hw2db_test';
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
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
    test('Should create a new city entry', async () => {
      const response = await request(app)
        .post('/api/data')
        .send(testCity)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.city).toBe(testCity.city);
      expect(response.body.data.population).toBe(testCity.population);
    });

    test('Should fail to create entry without required fields', async () => {
      const invalidCity = { city: 'Invalid City' };

      const response = await request(app)
        .post('/api/data')
        .send(invalidCity)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // READ Tests
  describe('GET /api/data', () => {
    test('Should get all city entries', async () => {
      // Insert test data
      await DataModel.create(testCity);

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
    test('Should get a city by ID', async () => {
      const created = await DataModel.create(testCity);

      const response = await request(app)
        .get(`/api/data/${created._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.city).toBe(testCity.city);
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
    test('Should update a city entry', async () => {
      const created = await DataModel.create(testCity);
      const updatedData = { population: 600000, growthRate: 3.5 };

      const response = await request(app)
        .put(`/api/data/${created._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.population).toBe(600000);
      expect(response.body.data.growthRate).toBe(3.5);
    });

    test('Should return 404 when updating non-existent entry', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/data/${fakeId}`)
        .send({ population: 123456 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // DELETE Tests
  describe('DELETE /api/data/:id', () => {
    test('Should delete a city entry', async () => {
      const created = await DataModel.create(testCity);

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
    // Insert multiple cities for question tests
    await DataModel.insertMany([
      {
        city: 'City A',
        population: 100000,
        growthRate: 5.0,
        density: 1000,
        averageAge: 30.0
      },
      {
        city: 'City B',
        population: 500000,
        growthRate: 2.0,
        density: 3000,
        averageAge: 40.0
      },
      {
        city: 'City C',
        population: 250000,
        growthRate: 3.5,
        density: 2000,
        averageAge: 35.0
      }
    ]);
  });

  // Question 1 Test
  describe('GET /api/questions/1', () => {
    test('Should return the fastest growing city', async () => {
      const response = await request(app)
        .get('/api/questions/1')
        .expect(200);

      expect(response.body.question).toContain('fastest growing');
      expect(response.body.answer).toBe('City A');
      expect(response.body.details.growthRate).toBe(5.0);
    });
  });

  // Question 2 Test
  describe('GET /api/questions/2', () => {
    test('Should return the most populous city', async () => {
      const response = await request(app)
        .get('/api/questions/2')
        .expect(200);

      expect(response.body.question).toContain('most populous');
      expect(response.body.answer).toBe('City B');
      expect(response.body.details.population).toBe(500000);
    });
  });

  // Question 3 Test
  describe('GET /api/questions/3', () => {
    test('Should return the average population', async () => {
      const response = await request(app)
        .get('/api/questions/3')
        .expect(200);

      expect(response.body.question).toContain('average population');
      expect(response.body.details.averagePopulation).toBe(283333); // (100000 + 500000 + 250000) / 3
      expect(response.body.details.totalCities).toBe(3);
    });
  });

  // Question 4 Test
  describe('GET /api/questions/4', () => {
    test('Should return the city with highest density', async () => {
      const response = await request(app)
        .get('/api/questions/4')
        .expect(200);

      expect(response.body.question).toContain('highest population density');
      expect(response.body.answer).toBe('City B');
      expect(response.body.details.density).toBe(3000);
    });
  });

  // Question 5 Test
  describe('GET /api/questions/5', () => {
    test('Should return total population of all cities', async () => {
      const response = await request(app)
        .get('/api/questions/5')
        .expect(200);

      expect(response.body.question).toContain('total population');
      expect(response.body.details.totalPopulation).toBe(850000); // 100000 + 500000 + 250000
      expect(response.body.details.numberOfCities).toBe(3);
    });
  });

  // Question 6 Test
  describe('GET /api/questions/6', () => {
    test('Should return cities with growth rate above 3%', async () => {
      const response = await request(app)
        .get('/api/questions/6')
        .expect(200);

      expect(response.body.question).toContain('growth rate above 3%');
      expect(response.body.count).toBe(2); // City A (5.0%) and City C (3.5%)
      expect(response.body.details).toHaveLength(2);
    });
  });

  // Question 7 Test
  describe('GET /api/questions/7', () => {
    test('Should return the youngest city', async () => {
      const response = await request(app)
        .get('/api/questions/7')
        .expect(200);

      expect(response.body.question).toContain('youngest city');
      expect(response.body.answer).toBe('City A');
      expect(response.body.details.averageAge).toBe(30.0);
    });
  });

  // Question 8 Test
  describe('GET /api/questions/8', () => {
    test('Should return count of cities with population > 200,000', async () => {
      const response = await request(app)
        .get('/api/questions/8')
        .expect(200);

      expect(response.body.question).toContain('population greater than 200,000');
      expect(response.body.answer).toBe(2); // City B (500000) and City C (250000)
      expect(response.body.details.count).toBe(2);
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
