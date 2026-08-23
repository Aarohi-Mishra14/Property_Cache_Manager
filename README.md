# Property_Cache_Manager

A small internal tool built for Property Listings' floor staff, replacing the paper and Excel process they were using to track property records. There's a real cache-aside layer sitting in front of MySQL — you can actually watch Redis cache hits, misses, and invalidations happen live from the UI.

🔗 Live demo: https://property-cache-manager.vercel.app

## What it does

- Add, edit, delete and search property listings
- Every read request checks Redis first before touching the database
- A dashboard shows real counts pulled from the DB (nothing hardcoded)
- A dedicated page shows which Redis keys are currently cached and their remaining TTL
- An activity log shows the actual HIT / MISS / SET / INVALIDATE history, so you can see the caching logic working instead of just trusting that it does
  
## Stack

- **Frontend:** React + Vite, plain CSS (no Tailwind/component library)
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Cache:** Redis
  
## How it works

Every create/update/delete invalidates the relevant cached entries, so you never see stale data after a write.

## Running it locally

You'll need MySQL and Redis installed and running.

```bash
# 1. Set up the database
mysql -u root -p -e "CREATE DATABASE redis_cache_manager"
mysql -u root -p redis_cache_manager < database/schema.sql
mysql -u root -p redis_cache_manager < database/seed.sql   # optional sample data

# 2. Backend
cd backend
cp .env.example .env   # fill in your MySQL password
npm install
npm run dev

# 3. Frontend (in a separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```
Then open `http://localhost:5173`.

## Known limitations

- No authentication — wasn't part of the brief
- Search is a basic SQL `LIKE`, not full-text search
- No automated test suite yet — see docs/TESTING.md for the manual test scenarios
