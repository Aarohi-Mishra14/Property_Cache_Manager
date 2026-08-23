# API Contracts

Base URL: `http://localhost:5000/api`

All responses are JSON. Successful responses wrap data in `{ "data": ... }`
(list endpoints also include a `meta` object). Error responses use
`{ "error": "message" }`, and validation failures additionally include
`fieldErrors`.

---

## GET /api/properties

**Purpose:** List properties, optionally filtered by search text and status.
Backed by Redis — the result is cached per unique combination of `search`
and `status`.

**Request query params:**
- `search` (optional string) — matches against title or location
- `status` (optional: `available` | `sold` | `rented`)

**Success (200):**
```json
{ "data": [ { "id": 1, "title": "...", "status": "available", ... } ], "meta": { "fromCache": true } }
```

**Error (500):**
```json
{ "error": "Something went wrong on our end. Please try again." }
```

---

## GET /api/properties/:id

**Purpose:** Get a single property. Cached in Redis for 300 seconds.

**Request:** `id` must be numeric.

**Success (200):** `{ "data": { ...property }, "meta": { "fromCache": false } }`

**Error (400):** `{ "error": "Property id must be a number." }`
**Error (404):** `{ "error": "Property not found." }`

---

## POST /api/properties

**Purpose:** Create a property. Invalidates all list caches on success.

**Request body:**
```json
{
  "title": "string (3-150 chars)",
  "location": "string (2-150 chars)",
  "propertyType": "apartment | house | villa | plot | commercial",
  "price": "number >= 0",
  "bedrooms": "integer >= 0 (optional)",
  "bathrooms": "integer >= 0 (optional)",
  "areaSqft": "integer >= 0 (optional)",
  "status": "available | sold | rented (optional, default available)"
}
```

**Success (201):** `{ "data": { ...created property } }`

**Error (400):** `{ "error": "Validation failed.", "fieldErrors": [ { "field": "title", "message": "..." } ] }`

---

## PUT /api/properties/:id

**Purpose:** Update a property. Invalidates its detail cache and all list caches.

**Request body:** same shape as POST.

**Success (200):** `{ "data": { ...updated property } }`
**Error (400):** validation failure, same shape as POST
**Error (404):** `{ "error": "Property not found." }`

---

## DELETE /api/properties/:id

**Purpose:** Delete a property. Invalidates its detail cache and all list caches.

**Success (200):** `{ "data": { "id": 1 } }`
**Error (404):** `{ "error": "Property not found." }`

---

## GET /api/cache/entries

**Purpose:** List currently active Redis keys related to properties, with
their remaining TTL in seconds. Powers the Cache Entries page.

**Success (200):**
```json
{ "data": [ { "key": "property:1", "ttlSeconds": 245 } ], "meta": { "redisConnected": true } }
```

---

## DELETE /api/cache/entries/:key

**Purpose:** Manually clear one Redis key (used by the Cache Entries page).

**Success (200):** `{ "data": { "key": "property:1" } }`
**Error (404):** `{ "error": "Cache entry not found or already expired." }`

---

## GET /api/cache/activity

**Purpose:** List the most recent cache activity events (HIT, MISS, SET,
INVALIDATE) from `cache_activity_log`. Powers the Activity Log page.

**Request query params:** `limit` (optional, default 50, max 200)

**Success (200):** `{ "data": [ { "id": 1, "cache_key": "...", "event_type": "HIT", "property_id": 3, "created_at": "..." } ] }`

---

## GET /api/dashboard/stats

**Purpose:** Real aggregate counts for the Dashboard page — total
properties, counts by status, active cache entry count, and Redis
connection status.

**Success (200):**
```json
{
  "data": {
    "totalProperties": 6,
    "byStatus": [ { "status": "available", "count": 4 } ],
    "activeCacheEntries": 3,
    "redisConnected": true
  }
}
```

---

## GET /api/health

**Purpose:** Basic liveness check.

**Success (200):** `{ "status": "ok" }`
