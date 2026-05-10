# My City Slow — iOS Testing & Verification Guide

This guide ensures the backend is 100% ready before you begin development on the iOS application. 

## 1. Setup Instructions

1. **Environment Variables**: Ensure `.env` contains the MongoDB Atlas URI.
2. **Install Dependencies**: 
   ```bash
   npm install
   ```
3. **Seed Database** *(If not already done)*:
   ```bash
   npm run seed
   ```
   *Note: This creates 10 cities, 19 spots, an Admin user, and a Demo user.*
4. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:3000.*

---

## 2. Postman Collection

I have generated a ready-to-import Postman Collection for you:
👉 **File:** `my-city-slow.postman_collection.json` (located in the root folder)

**How to use:**
1. Open Postman.
2. Click **Import** (top left).
3. Drag and drop the `my-city-slow.postman_collection.json` file.
4. An environment variable `{{base_url}}` defaults to `http://localhost:3000` and `{{token}}` will be used for Auth routes.

---

## 3. Test Scenarios (Manual Flow)

Here are the flows the iOS app will use, which you should verify:

### A. Auth Flow (Register & Login)
1. **Register**: Send `POST /api/auth/register` with `{"name": "iOS Dev", "email": "ios@test.com", "password": "Password@123"}`.
2. **Login**: Send `POST /api/auth/login` to receive an `accessToken` and `refreshToken`.
3. **Protected Route**: Send `GET /api/auth/profile` with `Authorization: Bearer <accessToken>`.

### B. Browsing Discovery with Filters
1. **Get Cities**: `GET /api/cities` should return a list of cities.
2. **Filtered Discovery**: 
   - Test Vibe: `GET /api/discovery/spots?vibe=very-calm`
   - Test Categories: `GET /api/discovery/spots?category=parks`
   - Test City Slug: `GET /api/discovery/spots?city=bengaluru`
3. **GeoSpatial Nearby**:
   - Query: `GET /api/spots/nearby?lat=12.9716&lng=77.5946&radius=15`
   - Should return spots sorted by driving distance from the provided coordinates.

### C. Collections (Saving Spots)
*Requires an access token.*
1. **Save Spot**: `POST /api/collection/<spot_id>`
2. **Get Collection**: `GET /api/collection` — Should list the spot you just saved.
3. **Unsave Spot**: `DELETE /api/collection/<spot_id>`

### D. Submitting a New Spot & Admin Approval
1. **User Submits**: 
   - `POST /api/spots/submit` with headers Auth token. 
   - Payload: `{"title": "Secret Garden", "description": "Quiet place", "city": "Bengaluru"}`
2. **Admin Approves** (Open your React CMS on `http://localhost:5173`):
   - Login as `admin@mycityslow.com`.
   - Go to **Submissions** tab.
   - Click **Approve**.
3. **Verify**: The approved spot now appears in `GET /api/discovery/spots`.

---

## 4. Verification Checklist

Before starting Xcode / Swift development, check off these items:

- [ ] **Base Endpoints:** `/api/health` and `/api/home` return HTTP 200 with valid JSON.
- [ ] **Authentication:** JWT tokens are issued correctly, and expired tokens return `401 Unauthorized`.
- [ ] **Data Model:** Endpoints return the exact JSON keys expected by your Swift `Codable` models (e.g., `_id`, `peaceScore`, etc.).
- [ ] **Geospatial Indexes:** Nearby search successfully filters based on distance.
- [ ] **Filters Combination:** Passing `?city=mumbai&vibe=very-calm` properly intersects filters.
- [ ] **CMS Works:** React admin panel can edit Spots and approve/reject moderation tickets effortlessly.
- [ ] **Image Uploads (Optional test):** If you hit `POST /api/upload` via Postman with form-data `image`, it returns a valid URL.
