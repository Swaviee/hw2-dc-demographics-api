# 📋 HW2 Submission Checklist

Use this checklist to ensure you have everything ready before submitting.

---

## ✅ Part 1: Code Completion (35 points)

### MongoDB Integration (5 points)
- [ ] MongoDB connection works (local or Atlas)
- [ ] Database successfully seeded with data
- [ ] Mongoose schema properly defined
- [ ] Connection error handling implemented

### RESTful CRUD API (10 points)
- [ ] `GET /api/data` - Get all cities ✓
- [ ] `GET /api/data/:id` - Get city by ID ✓
- [ ] `POST /api/data` - Create new city ✓
- [ ] `PUT /api/data/:id` - Update city ✓
- [ ] `DELETE /api/data/:id` - Delete city ✓
- [ ] Proper error handling (404, 500, etc.)
- [ ] Input validation working

### Eight Question Endpoints (12 points)
- [ ] Question 1: Fastest growing city ✓
- [ ] Question 2: Most populous city ✓
- [ ] Question 3: Average population ✓
- [ ] Question 4: Highest density ✓
- [ ] Question 5: Total population ✓
- [ ] Question 6: Growth rate > 3% ✓
- [ ] Question 7: Youngest city ✓
- [ ] Question 8: Population > 200k ✓
- [ ] All questions return proper JSON format
- [ ] MongoDB aggregation queries work correctly

### Unit Tests with Jest (8 points)
- [ ] Jest installed and configured
- [ ] Tests for at least 1 CRUD route (e.g., CREATE, READ)
- [ ] Tests for at least 2 question endpoints
- [ ] All tests passing (`npm test` shows green ✓)
- [ ] Test coverage report generated
- [ ] Tests verify response structure
- [ ] Tests check error cases

---

## ✅ Part 2: Documentation (10 points)

### Postman/curl Screenshots (5 points)

**CRUD Operations (5 screenshots):**
- [ ] 01-get-all-cities.png
- [ ] 02-get-city-by-id.png
- [ ] 03-create-city.png
- [ ] 04-update-city.png
- [ ] 05-delete-city.png

**Question Endpoints (8 screenshots):**
- [ ] 06-question-1.png (Fastest growing city)
- [ ] 07-question-2.png (Most populous city)
- [ ] 08-question-3.png (Average population)
- [ ] 09-question-4.png (Highest density)
- [ ] 10-question-5.png (Total population)
- [ ] 11-question-6.png (Growth > 3%)
- [ ] 12-question-7.png (Youngest city)
- [ ] 13-question-8.png (Pop > 200k)

**Git History (1 screenshot):**
- [ ] 14-git-commits.png (Shows 5+ commits with clear messages)

**Total Screenshots:** 14

### README Documentation (5 points)
- [ ] Project description and overview
- [ ] Tech stack listed
- [ ] Prerequisites clearly stated
- [ ] Installation instructions (step-by-step)
- [ ] Database setup instructions
- [ ] How to run the application
- [ ] API endpoints documented
- [ ] Testing instructions included
- [ ] Troubleshooting section
- [ ] **GitHub repository link included**

---

## ✅ Part 3: Git & GitHub (5 points)

### Git Repository (5 points)
- [ ] Git repository initialized (`git init`)
- [ ] At least **5 meaningful commits**
- [ ] Commit messages are clear and descriptive
- [ ] `.gitignore` file present (excludes node_modules, .env)
- [ ] Project pushed to GitHub
- [ ] Repository is public OR private (with professor access)
- [ ] GitHub link in README.md
- [ ] All files properly organized

### Example Good Commits:
```
✓ feat: Add project configuration and dependencies
✓ feat: Create Mongoose schema for city data
✓ feat: Implement CRUD operations
✓ feat: Add 8 analytical question endpoints
✓ test: Add Jest unit tests for API
✓ docs: Add comprehensive README and screenshots
```

---

## ✅ Part 4: Project Structure

### Required Files Present:
- [ ] `app.js` - Main application file
- [ ] `package.json` - Dependencies and scripts
- [ ] `.env` - Environment variables
- [ ] `.gitignore` - Git ignore rules
- [ ] `README.md` - Complete documentation

### Required Folders Present:
- [ ] `models/` - Contains dataModel.js
- [ ] `routes/` - Contains api.js
- [ ] `controllers/` - Contains dataController.js
- [ ] `tests/` - Contains api.test.js
- [ ] `data/` - Contains sample data and seed script

---

## ✅ Part 5: Functionality Verification

### Before Submitting, Test:

**Server Starts:**
```bash
npm start
# Should show: 🚀 Server is running on http://localhost:3000
```

**Database Connects:**
```bash
# Should show: ✅ Successfully connected to MongoDB
```

**All Endpoints Work:**
- [ ] Navigate to `http://localhost:3000` - Shows API documentation
- [ ] Test all CRUD operations in Postman/curl
- [ ] Test all 8 question endpoints
- [ ] Verify responses are JSON format
- [ ] Check error handling (try invalid IDs, missing fields)

**All Tests Pass:**
```bash
npm test
# Should show: Tests: X passed, X total
```

---

## ✅ Part 6: Code Quality

- [ ] Code is properly indented and formatted
- [ ] Functions have clear, descriptive names
- [ ] Comments explain complex logic
- [ ] No console.log debugging statements left in production code
- [ ] Error messages are helpful and descriptive
- [ ] Async/await used correctly (no unhandled promises)
- [ ] No sensitive data (passwords, API keys) in GitHub

---

## ✅ Final Submission Package

### What to Submit:

1. **Source Code:**
   - [ ] Entire project folder (or GitHub link)
   - [ ] All files in proper structure
   - [ ] No node_modules folder (excluded by .gitignore)

2. **Screenshots:**
   - [ ] Folder named "screenshots" with all 14 images
   - [ ] Clear, readable screenshots
   - [ ] Proper naming convention

3. **README.md:**
   - [ ] Complete with all sections filled
   - [ ] **GitHub repository link at the top**
   - [ ] Your name as author

4. **Git History:**
   - [ ] Screenshot of `git log` or GitHub commits page
   - [ ] Shows 5+ commits with clear messages

---

## 📊 Points Breakdown

| Category | Points | Status |
|----------|--------|--------|
| MongoDB Integration | 5 | ☐ |
| RESTful CRUD API | 10 | ☐ |
| Eight Question Endpoints | 12 | ☐ |
| Unit Tests (Jest) | 8 | ☐ |
| Screenshots | 5 | ☐ |
| GitHub Usage | 5 | ☐ |
| README Documentation | 5 | ☐ |
| **TOTAL** | **50** | |

---

## 🎯 Quick Verification Commands

Run these before submitting:

```bash
# Check Git commits
git log --oneline

# Verify tests pass
npm test

# Check server starts
npm start

# Verify all files present
ls -R
# or on Windows:
dir /s
```

---

## ⚠️ Common Mistakes to Avoid

- ❌ Forgetting to include GitHub link in README
- ❌ Less than 5 Git commits
- ❌ node_modules folder in GitHub
- ❌ .env file committed to GitHub
- ❌ Tests not passing
- ❌ Screenshots unclear or incomplete
- ❌ MongoDB connection string with hardcoded password
- ❌ Missing error handling
- ❌ Endpoints not following RESTful conventions

---

## ✅ Ready to Submit?

If you checked all boxes above, you're ready to submit! 🎉

### Final Steps:

1. **Double-check GitHub:**
   - [ ] Code is pushed
   - [ ] Repository is accessible
   - [ ] README has correct link

2. **Organize Screenshots:**
   - [ ] All 14 screenshots in one folder
   - [ ] Named clearly (01-get-all-cities.png, etc.)

3. **Verify README:**
   - [ ] GitHub link is clickable and correct
   - [ ] Your name is listed as author

4. **Test One More Time:**
   - [ ] Clone your GitHub repo to a new folder
   - [ ] Run `npm install`
   - [ ] Run `npm start`
   - [ ] Verify it works

5. **Submit:**
   - [ ] Upload to course portal
   - [ ] Include GitHub link in submission notes
   - [ ] Submit before deadline

---

## 🎓 Grading Criteria Met

- ✅ Professional code structure
- ✅ Complete functionality
- ✅ Comprehensive testing
- ✅ Proper documentation
- ✅ Good Git practices
- ✅ All requirements fulfilled

---

**Last Updated:** November 2025
**Status:** Ready for Final Review
