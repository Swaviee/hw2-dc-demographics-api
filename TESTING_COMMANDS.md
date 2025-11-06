# Testing Commands

Complete set of curl commands to test all API endpoints.

## Prerequisites

Make sure your server is running:
```bash
npm start
```

---

## CRUD Operations

### 1. GET All Cities

```bash
curl http://localhost:3000/api/data
```

**Screenshot:** Save as `01-get-all-cities.png`

---

### 2. GET City by ID

First, get an ID from the GET all cities response, then:

```bash
curl http://localhost:3000/api/data/YOUR_CITY_ID_HERE
```

**Screenshot:** Save as `02-get-city-by-id.png`

---

### 3. POST - Create New City

```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d "{\"city\":\"Boston\",\"population\":690000,\"growthRate\":1.8,\"density\":5400,\"averageAge\":37.5,\"country\":\"USA\",\"region\":\"Northeast\",\"medianIncome\":75000}"
```

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/data -H "Content-Type: application/json" -d '{\"city\":\"Boston\",\"population\":690000,\"growthRate\":1.8,\"density\":5400,\"averageAge\":37.5,\"country\":\"USA\",\"region\":\"Northeast\",\"medianIncome\":75000}'
```

**Screenshot:** Save as `03-create-city.png`

---

### 4. PUT - Update City

Use an ID from your database:

```bash
curl -X PUT http://localhost:3000/api/data/YOUR_CITY_ID_HERE \
  -H "Content-Type: application/json" \
  -d "{\"population\":700000,\"growthRate\":2.0}"
```

**Windows PowerShell:**
```powershell
curl.exe -X PUT http://localhost:3000/api/data/YOUR_CITY_ID_HERE -H "Content-Type: application/json" -d '{\"population\":700000,\"growthRate\":2.0}'
```

**Screenshot:** Save as `04-update-city.png`

---

### 5. DELETE City

Use an ID from your database:

```bash
curl -X DELETE http://localhost:3000/api/data/YOUR_CITY_ID_HERE
```

**Screenshot:** Save as `05-delete-city.png`

---

## Question Endpoints

### Question 1: Fastest Growing City

```bash
curl http://localhost:3000/api/questions/1
```

**Screenshot:** Save as `06-question-1.png`

---

### Question 2: Most Populous City

```bash
curl http://localhost:3000/api/questions/2
```

**Screenshot:** Save as `07-question-2.png`

---

### Question 3: Average Population

```bash
curl http://localhost:3000/api/questions/3
```

**Screenshot:** Save as `08-question-3.png`

---

### Question 4: Highest Density

```bash
curl http://localhost:3000/api/questions/4
```

**Screenshot:** Save as `09-question-4.png`

---

### Question 5: Total Population

```bash
curl http://localhost:3000/api/questions/5
```

**Screenshot:** Save as `10-question-5.png`

---

### Question 6: Cities with Growth Rate > 3%

```bash
curl http://localhost:3000/api/questions/6
```

**Screenshot:** Save as `11-question-6.png`

---

### Question 7: Youngest City

```bash
curl http://localhost:3000/api/questions/7
```

**Screenshot:** Save as `12-question-7.png`

---

### Question 8: Cities with Population > 200,000

```bash
curl http://localhost:3000/api/questions/8
```

**Screenshot:** Save as `13-question-8.png`

---

## Git Commands

### View Commit History

```bash
git log --oneline
```

**Screenshot:** Save as `14-git-commits.png`

Or take a screenshot from GitHub commits page after pushing.

---

## Postman Alternative

If using Postman instead of curl:

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Create new collection "HW2 API"

2. **Create Requests:**
   - Add each endpoint above as a new request
   - Set appropriate HTTP method (GET, POST, PUT, DELETE)
   - Add request body for POST/PUT as JSON

3. **Test Each Endpoint:**
   - Click "Send"
   - Verify response
   - Take screenshot

---

## Tips for Screenshots

### Good Screenshot Checklist:
- ✅ Shows the full URL in address bar
- ✅ Shows the HTTP method (GET, POST, PUT, DELETE)
- ✅ Shows request body (for POST/PUT)
- ✅ Shows complete JSON response
- ✅ Shows response status code (200, 201, 404, etc.)
- ✅ Image is clear and readable

### Screenshot Tools:
- **Windows:** Snipping Tool or Win+Shift+S
- **Mac:** Cmd+Shift+4
- **Postman:** Built-in screenshot feature

---

## Verification Checklist

Before submitting, verify you have:

- [ ] 5 CRUD operation screenshots
- [ ] 8 question endpoint screenshots
- [ ] 1 git commit history screenshot
- [ ] Total: 14 screenshots

---

## Testing with Jest

To verify all tests pass:

```bash
npm test
```

This will test:
- ✅ All CRUD operations
- ✅ All 8 question endpoints
- ✅ Error handling
- ✅ Edge cases

Screenshot the test results showing all tests passing.

---

## Quick Test Script

Run all curl commands at once (bash):

```bash
#!/bin/bash

echo "Testing HW2 API..."
echo ""

echo "1. GET all cities"
curl http://localhost:3000/api/data
echo -e "\n\n"

echo "2. Question 1"
curl http://localhost:3000/api/questions/1
echo -e "\n\n"

echo "3. Question 2"
curl http://localhost:3000/api/questions/2
echo -e "\n\n"

# Continue for all questions...
```

Save as `test-api.sh`, make executable (`chmod +x test-api.sh`), and run (`./test-api.sh`).

---

## Need Help?

- Check that server is running on port 3000
- Verify MongoDB is connected
- Check request format (JSON must be valid)
- Look at server console for error messages
- Review README.md troubleshooting section
