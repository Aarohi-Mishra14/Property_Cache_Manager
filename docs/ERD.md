# Entity Relationship Diagram

## Entities

**properties** — the permanent business record for a listing. This is the
only entity that represents real, durable data. It exists because the
project's core problem is managing property records that used to live on
paper and in Excel sheets.

**cache_activity_log** — a persistent audit trail of what the Redis layer
did for each request (HIT, MISS, SET, INVALIDATE). It exists so the
Activity/Logs page can show real, recorded cache behaviour instead of
fabricated numbers.

No other tables were introduced. Redis itself does not appear as a table —
it is a separate, in-memory cache layer sitting in front of `properties`,
not a second source of truth.

## Diagram

```
+-------------------------+          +-------------------------------+
|       properties        |          |      cache_activity_log        |
+-------------------------+          +-------------------------------+
| PK id                   |<---------| FK property_id (nullable)      |
|    title                |   1    N | PK id                           |
|    location              |          |    cache_key                   |
|    property_type        |          |    event_type (HIT/MISS/       |
|    price                 |          |               SET/INVALIDATE)  |
|    bedrooms              |          |    created_at                  |
|    bathrooms             |          +-------------------------------+
|    area_sqft             |
|    status                |
|    created_at            |
|    updated_at            |
+-------------------------+
```

## Relationships

- One `properties` row can have many `cache_activity_log` rows (a property
  gets requested many times over its life).
- `property_id` is nullable and uses `ON DELETE SET NULL`, because a log
  entry for a deleted property (or a list-level cache event with no single
  property) should still be visible in the activity history.

## Constraints

- `properties.price` has a `CHECK (price >= 0)` constraint.
- `properties.property_type` and `properties.status` are `ENUM` columns,
  which enforces valid values at the database level in addition to
  application-level validation.
- `cache_activity_log.event_type` is an `ENUM('HIT', 'MISS', 'SET', 'INVALIDATE')`.
