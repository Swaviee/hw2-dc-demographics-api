# HW2: DC Demographics RESTful API

**Student:** Henry Faya
**Student ID:** 5083025

---

## Project Description

This RESTful API is a continuation of HW1, where I analyzed DC Census Blocks 2020 demographic data from the DC Open Data Portal. HW2 transforms that analysis into a full-featured backend API with MongoDB database storage.

**Key Features:**
- RESTful API built with Node.js and Express
- MongoDB database integration using Mongoose
- Full CRUD operations for census block data
- Eight analytical question endpoints from HW1
- Comprehensive Jest unit tests
- Git version control with meaningful commits

**Dataset:** 1,000 DC Census Blocks from 2020 Census containing population, housing, and geographic data.

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hw2-restful-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB:**

   Edit the `.env` file with your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dc_demographics
   PORT=3000
   ```

4. **Seed the database:**
   ```bash
   node data/seedDatabase.js
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

   The API will be running at `http://localhost:3000`

6. **Run tests:**
   ```bash
   npm test
   ```

---

## API Endpoints

### Root Endpoint

**GET /** - Returns API documentation and welcome message

**Example:**
```bash
curl http://localhost:3000/
```

---

### CRUD Operations

#### 1. GET /api/data
**Description:** Retrieve all census blocks from the database

**Example:**
```bash
curl http://localhost:3000/api/data
```

**Response:**
```json
{
  "success": true,
  "count": 1000,
  "data": [...]
}
```

---

#### 2. GET /api/data/:id
**Description:** Retrieve a specific census block by MongoDB ID

**Example:**
```bash
curl http://localhost:3000/api/data/673b8c3f4e2a1b3c5d6e7f8a
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "673b8c3f4e2a1b3c5d6e7f8a",
    "geoid": "110010023001000",
    "block": "1000",
    "tract": "002300",
    "totalPopulation": 245,
    "hispanicPopulation": 42,
    "adultPopulation": 189,
    "housing": {
      "totalUnits": 98,
      "occupiedUnits": 91,
      "vacantUnits": 7
    },
    "geography": {
      "landArea": 45820,
      "waterArea": 0
    }
  }
}
```

---

#### 3. POST /api/data
**Description:** Create a new census block entry

**Example:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "geoid": "110010999991000",
    "block": "1000",
    "tract": "999900",
    "totalPopulation": 500,
    "hispanicPopulation": 100,
    "adultPopulation": 380,
    "housing": {
      "totalUnits": 200,
      "occupiedUnits": 190,
      "vacantUnits": 10
    },
    "geography": {
      "landArea": 50000,
      "waterArea": 0
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

#### 4. PUT /api/data/:id
**Description:** Update an existing census block by ID

**Example:**
```bash
curl -X PUT http://localhost:3000/api/data/673b8c3f4e2a1b3c5d6e7f8a \
  -H "Content-Type: application/json" \
  -d '{
    "totalPopulation": 600,
    "hispanicPopulation": 120
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

#### 5. DELETE /api/data/:id
**Description:** Delete a census block by ID

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/data/673b8c3f4e2a1b3c5d6e7f8a
```

**Response:**
```json
{
  "success": true,
  "message": "Census block deleted successfully"
}
```

---

### Question Endpoints (Analytical Queries from HW1)

#### Question 1: GET /api/questions/1
**Description:** What is the total population across all census blocks?

**Example:**
```bash
curl http://localhost:3000/api/questions/1
```

**Response:**
```json
{
  "question": "What is the total population across all census blocks?",
  "answer": "100,591",
  "details": {
    "totalPopulation": 100591,
    "censusBlocksAnalyzed": 1000
  }
}
```

---

#### Question 2: GET /api/questions/2
**Description:** What is the average population per census block?

**Example:**
```bash
curl http://localhost:3000/api/questions/2
```

**Response:**
```json
{
  "question": "What is the average population per census block?",
  "answer": "101",
  "details": {
    "averagePopulation": 100.591,
    "censusBlocksAnalyzed": 1000
  }
}
```

---

#### Question 3: GET /api/questions/3
**Description:** Which census block has the highest population density?

**Example:**
```bash
curl http://localhost:3000/api/questions/3
```

**Response:**
```json
{
  "question": "Which census block has the highest population density?",
  "answer": "Block 110010059001009 with 114,286 people per sq km",
  "details": {
    "geoid": "110010059001009",
    "density": 114285.71428571429,
    "population": 160,
    "landArea": 1400
  }
}
```

---

#### Question 4: GET /api/questions/4
**Description:** What percentage of housing units are vacant citywide?

**Example:**
```bash
curl http://localhost:3000/api/questions/4
```

**Response:**
```json
{
  "question": "What percentage of housing units are vacant citywide?",
  "answer": "10.84%",
  "details": {
    "vacancyPercentage": 10.84,
    "totalHousingUnits": 54824,
    "vacantUnits": 5942
  }
}
```

---

#### Question 5: GET /api/questions/5
**Description:** Which tract has the most total housing units?

**Example:**
```bash
curl http://localhost:3000/api/questions/5
```

**Response:**
```json
{
  "question": "Which tract has the most total housing units?",
  "answer": "Tract 004701 with 1,368 units",
  "details": {
    "tract": "004701",
    "totalUnits": 1368
  }
}
```

---

#### Question 6: GET /api/questions/6
**Description:** What is the median land area of census blocks?

**Example:**
```bash
curl http://localhost:3000/api/questions/6
```

**Response:**
```json
{
  "question": "What is the median land area of census blocks?",
  "answer": "10,878 square meters",
  "details": {
    "medianLandArea": 10877.5,
    "blocksAnalyzed": 1000
  }
}
```

---

#### Question 7: GET /api/questions/7
**Description:** How many census blocks have zero population?

**Example:**
```bash
curl http://localhost:3000/api/questions/7
```

**Response:**
```json
{
  "question": "How many census blocks have zero population?",
  "answer": "273",
  "details": {
    "zeroPopulationBlocks": 273,
    "totalBlocks": 1000,
    "percentage": 27.3
  }
}
```

---

#### Question 8: GET /api/questions/8
**Description:** What is the ratio of Hispanic to total population across all blocks?

**Example:**
```bash
curl http://localhost:3000/api/questions/8
```

**Response:**
```json
{
  "question": "What is the ratio of Hispanic to total population across all blocks?",
  "answer": "0.0977",
  "details": {
    "hispanicRatio": 0.09773188494449027,
    "hispanicPopulation": 9830,
    "totalPopulation": 100591
  }
}
```

---

## GitHub Repository

**Repository URL:** https://github.com/Swaviee/hw2-dc-demographics-api

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Jest** - Testing framework
- **Supertest** - HTTP assertions for testing

---

## Project Structure

```
hw2-restful-api/
├── models/
│   └── dataModel.js          # Mongoose schema for census blocks
├── routes/
│   └── api.js                # API route definitions
├── controllers/
│   └── dataController.js     # Business logic for all endpoints
├── tests/
│   └── api.test.js           # Jest unit tests
├── data/
│   ├── sampleData.json       # Sample census block data
│   └── seedDatabase.js       # Database seeding script
├── app.js                     # Main application entry point
├── package.json               # Project dependencies
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

---

## Testing

Run the Jest test suite:

```bash
npm test
```

The test suite includes:
- 10 CRUD operation tests (all 5 endpoints)
- 8 Question endpoint tests
- 1 Root endpoint test
- Total: 19 tests

All tests verify proper API responses, error handling, and data validation.

---

## Author

Henry Faya - Student ID: 5083025
