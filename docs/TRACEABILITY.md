# Requirement Traceability

| Requirement | Implementation | Location |
|---|---|---|
| Empty state | `EmptyState` component, used on Properties, Cache Entries, Activity Log | `frontend/src/components/EmptyState.jsx` |
| Loading state | `LoadingState` component | `frontend/src/components/LoadingState.jsx` |
| Error state + retry | `ErrorState` component with `onRetry` | `frontend/src/components/ErrorState.jsx` |
| Request timeout on slow connections | `AbortController` with an 8s timeout | `frontend/src/services/api.js` |
| Input validation (client) | `validatePropertyForm` | `frontend/src/utils/validators.js` |
| Input validation (server) | `validateProperty` | `backend/utils/validateProperty.js` |
| Input sanitization | `sanitizeText` (client), `validator.escape` (server) | `frontend/src/utils/sanitize.js`, `backend/utils/validateProperty.js` |
| Parameterized SQL queries | All queries use `?` placeholders | `backend/services/propertyService.js` |
| No hardcoded secrets | `.env` / `.env.example`, values read via `process.env` | `backend/.env.example`, `backend/config/db.js`, `backend/config/redis.js` |
| Safe error responses | Generic message returned, real error logged server-side only | `backend/middleware/errorHandler.js` |
| Redis cache-aside pattern | `getOrSetCache` | `backend/services/cacheService.js` |
| Cache invalidation on write | `invalidatePropertyCache` called after create/update/delete | `backend/controllers/propertyController.js` |
| Cache TTL | `CACHE_TTL_PROPERTY_LIST` (60s), `CACHE_TTL_PROPERTY_DETAIL` (300s) | `backend/.env.example`, `backend/controllers/propertyController.js` |
| Redis unavailable does not crash the app | `isRedisConnected()` guards, try/catch around every Redis call | `backend/config/redis.js`, `backend/services/cacheService.js` |
| Database failure does not crash the app | Errors are caught and passed to `errorHandler` | `backend/controllers/*.js`, `backend/middleware/errorHandler.js` |
| Analytics simulation | `console.log('[Analytics] User interacted with Redis Caching')` on successful create/update/delete/search/cache-clear | `frontend/src/pages/Properties.jsx`, `frontend/src/pages/CacheEntries.jsx` |
| Keyboard navigation + focus states | Native semantic elements, `:focus-visible` outline in global styles | `frontend/src/styles/global.css` |
| Labels associated with inputs | `<label htmlFor>` paired with matching input `id` on every field | `frontend/src/components/PropertyFormModal.jsx` |
| Status not conveyed by color alone | `StatusBadge` always pairs a color with a text label | `frontend/src/components/StatusBadge.jsx` |
| Cache Entries page | Lists active Redis keys and TTL, manual clear action | `frontend/src/pages/CacheEntries.jsx`, `backend/controllers/cacheController.js` |
| Activity/Logs page | Persistent `cache_activity_log` table, queried and displayed | `database/schema.sql`, `frontend/src/pages/ActivityLog.jsx` |
| Dashboard with real (non-fake) stats | Counts come from `COUNT(*)` queries, not hardcoded numbers | `backend/controllers/dashboardController.js`, `frontend/src/pages/Dashboard.jsx` |
| Responsive layout | Sidebar collapses to a horizontal bar, forms stack to one column below 900px/768px | `frontend/src/styles/global.css` |
| Action-level error handling (save/delete/clear failures) | `InlineAlert` component, shown without hiding already-loaded data | `frontend/src/components/InlineAlert.jsx`, `frontend/src/pages/Properties.jsx`, `frontend/src/pages/CacheEntries.jsx` |
| Accessible names for repeated per-row buttons | Per-row `aria-label`s (Edit/Delete/Confirm/Cancel/Clear) include the property title or cache key | `frontend/src/pages/Properties.jsx`, `frontend/src/pages/CacheEntries.jsx` |
| Text/background contrast (4.5:1 minimum) | `--border-strong` darkened and sidebar brand text switched off `--text-muted` after both measured below WCAG minimums | `frontend/src/styles/tokens.css`, `frontend/src/styles/global.css` |
| Client/server validation parity for optional numeric fields | Backend now treats an empty string the same as "not provided", matching the frontend's own optional-field rule | `backend/utils/validateProperty.js` |
