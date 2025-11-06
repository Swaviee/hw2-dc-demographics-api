# 🚀 Quick Start Guide

Get your HW2 API running in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
cd hw2-restful-api
npm install
```

## Step 2: Start MongoDB (1 minute)

### Option A: Local MongoDB
```bash
# Windows - MongoDB should start automatically
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Option B: MongoDB Atlas
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env` file with your connection string

## Step 3: Seed Database (30 seconds)

```bash
node data/seedDatabase.js
```

You should see:
```
✅ Successfully inserted 10 cities
```

## Step 4: Start Server (30 seconds)

```bash
npm start
```

You should see:
```
🚀 Server is running on http://localhost:3000
```

## Step 5: Test API (2 minutes)

### In Browser:
Open: `http://localhost:3000`

### With curl:
```bash
# Get all cities
curl http://localhost:3000/api/data

# Get question 1
curl http://localhost:3000/api/questions/1
```

### With Postman:
1. Open Postman
2. Create GET request to `http://localhost:3000/api/data`
3. Click Send

## ✅ You're Ready!

Now test all endpoints and capture screenshots for your submission.

## Quick Commands Reference

```bash
# Start server
npm start

# Start with auto-reload
npm run dev

# Run tests
npm test

# Seed database
node data/seedDatabase.js

# View git commits
git log --oneline
```

## API Endpoints Quick Reference

```
GET    /api/data           - Get all cities
GET    /api/data/:id       - Get city by ID
POST   /api/data           - Create city
PUT    /api/data/:id       - Update city
DELETE /api/data/:id       - Delete city

GET    /api/questions/1    - Fastest growing city
GET    /api/questions/2    - Most populous city
GET    /api/questions/3    - Average population
GET    /api/questions/4    - Highest density
GET    /api/questions/5    - Total population
GET    /api/questions/6    - Cities with growth > 3%
GET    /api/questions/7    - Youngest city
GET    /api/questions/8    - Cities with pop > 200k
```

## Troubleshooting

**MongoDB won't start:**
- Check if it's already running: `mongosh` or `mongo`
- Try restarting your computer

**Port 3000 in use:**
- Change `PORT=3001` in .env file

**npm install errors:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**Still stuck?**
- Check the full README.md
- Verify Node.js is installed: `node --version`
- Verify npm is installed: `npm --version`
