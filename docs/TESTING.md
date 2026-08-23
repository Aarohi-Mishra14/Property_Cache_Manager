# Manual Testing Checklist

These were the scenarios walked through manually against a local backend
(MySQL + Redis both running) and the Vite dev server.

| # | Scenario | Steps | Expected result |
|---|----------|-------|------------------|
| 1 | Valid form submission | Open Properties → Add property → fill all fields correctly → Submit | Property is created, list refreshes, modal closes |
| 2 | Empty form | Add property → submit with all fields blank | Title, location, price, property type, status show inline errors; no request is sent |
| 3 | Invalid input | Enter price as `-500` or bedrooms as `abc` | Field-level error shown, submission blocked |
| 4 | Search with results | Search for a known title/location substring | Matching rows shown |
| 5 | Search with no results | Search for a nonsense string like `zzzznotfound` | "No properties found" empty state with a hint shown |
| 6 | Network failure | Stop the backend, reload the Properties page | Error state with "Try again" button shown, app does not crash |
| 7 | Redis cache hit | Load a property detail twice within TTL | Second request returns `meta.fromCache: true`; a HIT row appears in Activity Log |
| 8 | Redis cache miss | Restart Redis (clears keys), then request a property | `meta.fromCache: false`; a MISS then a SET row appear in Activity Log |
| 9 | Database failure | Stop MySQL, request the properties list | Error state shown, no crash, safe generic error message |
| 10 | Keyboard navigation | Tab through sidebar, search box, table actions, and the Add Property form | Every control reachable by Tab, visible focus ring on each, form submittable with Enter |
| 11 | Loading state | Throttle network to slow 3G in devtools, reload Properties | "Loading properties..." shown until data arrives, no blank screen |
| 12 | Retry functionality | Trigger an error state, click "Try again" | Request re-fires and succeeds once the backend/service is back |
| 13 | XSS input | Enter `<script>alert(1)</script>` as a property title | Angle brackets are stripped client-side; backend `validator.escape` also neutralizes it; no script executes anywhere in the UI |
| 14 | API validation | Send a POST with an invalid `propertyType` directly (e.g. via curl) | Backend returns 400 with `fieldErrors`, even though the frontend would have blocked it |

## Notes

- Cache hit/miss behaviour was confirmed both through the `meta.fromCache`
  flag in API responses and by watching new rows appear in
  `cache_activity_log` via the Activity Log page.
- Redis and MySQL failure scenarios were tested by stopping each service
  individually with the other still running, confirming the app degrades
  gracefully rather than crashing.
