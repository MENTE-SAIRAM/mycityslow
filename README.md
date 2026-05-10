# 🌿 My City Slow — Backend API

**Discover the Peaceful Side of Your City**

A production-ready REST API built with **Express + TypeScript + MongoDB** for the My City Slow iOS app — a national peaceful spots discovery platform for India.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

### 3. Create Uploads Folder
```bash
mkdir -p uploads
```

### 4. Seed the Database
```bash
npm run seed
```
This creates:
- **10 Indian cities** (Bengaluru, Mumbai, Delhi, etc.)
- **20+ peaceful spots** with real coordinates
- **Admin user**: `admin@mycityslow.com` / `Admin@1234`
- **Demo user**: `demo@mycityslow.com` / `Demo@1234`

### 5. Start Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:3000`

---

## 📦 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server status |

### 🔐 Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login (returns JWT) |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/auth/profile` | ✅ | Get current user profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### 🏠 Home
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/home` | Optional | Personalized home (greeting, trending, categories) |

### 🔍 Discovery
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/discovery/spots` | — | Filtered discovery feed |
| GET | `/api/discovery/spots/:id` | — | Spot detail |

**Query params**: `city`, `category`, `vibe`, `bestTime`, `crowdLevel`, `activity`, `lat`, `lng`, `radius`, `search`, `page`, `limit`

### 📍 Spots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/spots/trending` | — | Top spots by peace score |
| GET | `/api/spots/nearby` | — | Geospatial nearby spots |
| POST | `/api/spots/submit` | ✅ | Submit new spot for review |

### 🏙️ Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cities` | All active cities |
| GET | `/api/cities/:citySlug` | City details + spot count |

### 💚 Collection (My Slow List)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/collection` | ✅ | User's saved spots |
| POST | `/api/collection/:spotId` | ✅ | Save a spot |
| DELETE | `/api/collection/:spotId` | ✅ | Remove from collection |

### 🔎 Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?query=...` | Search spots & cities |

### 🌐 Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community` | Coming soon |

### 📤 Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload` | ✅ | Single image upload |
| POST | `/api/upload/multiple` | ✅ | Multiple images (max 5) |

### 🛠️ Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/cities` | List/Create cities |
| PUT/DELETE | `/api/admin/cities/:id` | Update/Delete city |
| GET/POST | `/api/admin/spots` | List/Create spots |
| PUT/DELETE | `/api/admin/spots/:id` | Update/Delete spot |
| PUT | `/api/admin/spots/:id/approve` | Approve spot |
| PUT | `/api/admin/spots/:id/reject` | Reject spot |
| GET | `/api/admin/submissions` | Moderation queue |
| PUT | `/api/admin/submissions/:id/approve` | Approve submission |
| PUT | `/api/admin/submissions/:id/reject` | Reject submission |

---

## 🏗️ Project Structure

```
MY City Slow/
├── src/
│   ├── server.ts            # Entry point
│   ├── app.ts               # Express app setup
│   ├── seed.ts              # Database seeder
│   ├── config/
│   │   └── database.ts      # MongoDB connection
│   ├── middleware/
│   │   ├── auth.ts           # JWT auth + admin guard
│   │   ├── errorHandler.ts   # Global error handler
│   │   └── validate.ts       # Zod validation middleware
│   ├── models/
│   │   ├── User.ts
│   │   ├── City.ts
│   │   ├── Spot.ts
│   │   ├── SavedSpot.ts
│   │   └── SpotSubmission.ts
│   └── modules/
│       ├── auth/
│       ├── cities/
│       ├── spots/
│       ├── home/
│       ├── collection/
│       ├── community/
│       ├── search/
│       ├── upload/
│       └── admin/
├── frontend-cms/             # React admin panel (separate app)
├── uploads/                  # Uploaded images
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔑 Authentication

All protected endpoints require a JWT Bearer token:

```
Authorization: Bearer <your-access-token>
```

**Token flow:**
1. Register/Login → Get `accessToken` + `refreshToken`
2. Use `accessToken` in headers for protected routes
3. When expired, call `/api/auth/refresh` with `refreshToken`
4. Receive new `accessToken` + `refreshToken`

---

## 📱 iOS Integration Notes

- All responses follow a consistent JSON structure
- Pagination included in list endpoints
- GeoJSON format for location data: `{ type: "Point", coordinates: [lng, lat] }`
- Image URLs are relative paths (prefix with server base URL)
- Error responses include `success: false` and descriptive `message`

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build TypeScript to `dist/` |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |
