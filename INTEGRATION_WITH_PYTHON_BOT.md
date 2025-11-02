# Integrating Mini App with Your Existing Python Quiz Bot

This guide explains how to connect your Premium Quiz Bot Mini App with your existing Python Telegram bot so they share quiz data.

## 🔗 Integration Options

### Option 1: Shared PostgreSQL Database (Recommended)

Both your Python bot and the Mini App connect to the same PostgreSQL database.

#### Step 1: Set Up PostgreSQL Database

Create a PostgreSQL database on:
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free tier available
- **Koyeb Database** - If deploying on Koyeb

#### Step 2: Create Database Tables

```sql
-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Quizzes table
CREATE TABLE quizzes (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    questions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    published BOOLEAN DEFAULT FALSE
);

-- Quiz statistics table
CREATE TABLE quiz_stats (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL UNIQUE,
    total_quizzes INTEGER DEFAULT 0,
    free_quizzes INTEGER DEFAULT 0,
    paid_quizzes INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0
);
```

#### Step 3: Update Python Bot to Use PostgreSQL

Install required packages:
```bash
pip install psycopg2-binary sqlalchemy
```

Add to your Python bot:
```python
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Models
class Quiz(Base):
    __tablename__ = 'quizzes'
    
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, nullable=False)
    is_paid = Column(Boolean, default=False)
    questions = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    published = Column(Boolean, default=False)

class QuizStats(Base):
    __tablename__ = 'quiz_stats'
    
    id = Column(String, primary_key=True)
    user_id = Column(String, unique=True, nullable=False)
    total_quizzes = Column(Integer, default=0)
    free_quizzes = Column(Integer, default=0)
    paid_quizzes = Column(Integer, default=0)
    engagement = Column(Integer, default=0)

# Create tables
Base.metadata.create_all(engine)

# Helper functions
def save_quiz_to_db(quiz_data):
    """Save a quiz to the database"""
    session = SessionLocal()
    try:
        quiz = Quiz(**quiz_data)
        session.add(quiz)
        
        # Update stats
        stats = session.query(QuizStats).filter_by(user_id=quiz_data['user_id']).first()
        if stats:
            stats.total_quizzes += 1
            if quiz_data.get('is_paid'):
                stats.paid_quizzes += 1
            else:
                stats.free_quizzes += 1
        else:
            stats = QuizStats(
                id=str(uuid.uuid4()),
                user_id=quiz_data['user_id'],
                total_quizzes=1,
                free_quizzes=0 if quiz_data.get('is_paid') else 1,
                paid_quizzes=1 if quiz_data.get('is_paid') else 0,
                engagement=0
            )
            session.add(stats)
        
        session.commit()
        return quiz
    finally:
        session.close()

def get_user_quizzes(user_id):
    """Get all quizzes for a user"""
    session = SessionLocal()
    try:
        quizzes = session.query(Quiz).filter_by(user_id=str(user_id)).all()
        return [quiz.__dict__ for quiz in quizzes]
    finally:
        session.close()

def get_user_stats(user_id):
    """Get quiz statistics for a user"""
    session = SessionLocal()
    try:
        stats = session.query(QuizStats).filter_by(user_id=str(user_id)).first()
        return stats.__dict__ if stats else None
    finally:
        session.close()
```

#### Step 4: Update Mini App to Use PostgreSQL

Install Drizzle ORM (already included):
```bash
npm install drizzle-orm postgres
```

The schema is already defined in `shared/schema.ts`. Just update `server/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);
```

Then run migrations:
```bash
npm run db:push
```

#### Step 5: Environment Variables

**Python Bot (.env):**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
BOT_TOKEN=your_bot_token
```

**Mini App (.env):**
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
NODE_ENV=production
SESSION_SECRET=your_session_secret
```

---

### Option 2: REST API Integration

Your Python bot exposes a REST API that the Mini App calls.

#### Python Bot - Add API Endpoints

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for Mini App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-miniapp.koyeb.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats/{user_id}")
async def get_stats(user_id: str):
    """Get user quiz statistics"""
    stats = get_user_stats(user_id)  # Your existing function
    return stats or {
        "total_quizzes": 0,
        "free_quizzes": 0,
        "paid_quizzes": 0,
        "engagement": 0
    }

@app.get("/api/quizzes/{user_id}")
async def get_quizzes(user_id: str):
    """Get all quizzes for a user"""
    quizzes = get_user_quizzes(user_id)  # Your existing function
    return quizzes

@app.post("/api/quiz")
async def create_quiz(quiz_data: dict):
    """Create a new quiz"""
    quiz = save_quiz_to_db(quiz_data)  # Your existing function
    return quiz

@app.delete("/api/quiz/{quiz_id}")
async def delete_quiz(quiz_id: str):
    """Delete a quiz"""
    success = delete_quiz_from_db(quiz_id)  # Your existing function
    if not success:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {"success": True}

# Run alongside your bot
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### Mini App - Update API Calls

Update `server/routes.ts` to proxy to your Python bot:

```typescript
const PYTHON_BOT_API = process.env.PYTHON_BOT_API || 'http://localhost:8000';

app.get('/api/stats/:userId', async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_BOT_API}/api/stats/${req.params.userId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Similar for other endpoints...
```

---

### Option 3: File-Based Storage Sharing

If your Python bot uses files, mount the same volume in both containers.

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  python-bot:
    build: ./python-bot
    volumes:
      - quiz-data:/app/data
    environment:
      - BOT_TOKEN=${BOT_TOKEN}

  mini-app:
    build: ./mini-app
    ports:
      - "5000:5000"
    volumes:
      - quiz-data:/app/data
    environment:
      - PORT=5000

volumes:
  quiz-data:
```

---

## 🚀 Quick Start (PostgreSQL Method)

1. **Create PostgreSQL database** on Neon/Supabase
2. **Get connection string**: `postgresql://user:pass@host/db`
3. **Update both bots** with the same `DATABASE_URL`
4. **Run migrations** on both sides
5. **Deploy** and test

## ✅ Testing the Integration

1. **Create a quiz in the Mini App**
   - Open Mini App from Telegram
   - Create a quiz
   - Check database to confirm it's saved

2. **Verify in Python bot**
   - Query the database from your Python bot
   - The quiz should appear

3. **Test statistics sync**
   - Create/delete quizzes
   - Stats should update in both places

## 🔧 Troubleshooting

### Data Not Syncing

- **Check database connection** in both apps
- **Verify table names** match exactly
- **Check user IDs** are formatted the same way

### CORS Errors

Add your Mini App URL to CORS settings:
```python
allow_origins=["https://your-app.koyeb.app"]
```

### Connection Issues

- **Use connection pooling** for better performance
- **Set connection limits** to avoid exhausting database connections
- **Add retry logic** for transient failures

---

## 📝 Recommended Approach

For production, we recommend **Option 1 (Shared PostgreSQL)**:

✅ Real-time data sync
✅ No single point of failure  
✅ Easy to scale
✅ Industry standard
✅ Free tier available

---

Need help? Check the main README.md for deployment instructions!
