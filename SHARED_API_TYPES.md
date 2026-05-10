# Shared API Types — My City Slow

## Base Response Wrapper
All API responses follow this envelope:

```json
{
  "success": true,
  "message": "Success message or null",
  "data": { ... }
}
```

Paginated endpoints return:
```json
{
  "success": true,
  "data": {
    "spots": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasMore": true
    }
  }
}
```

## Key Endpoints

### Home
`GET /api/home?city=bengaluru`
```json
{
  "trendingSpots": [Spot],
  "authenticExperiences": [Experience],
  "guides": [CuratedGuide],
  "travelerTypes": ["slow-travel", "photography", ...],
  "currentCity": City
}
```

### Cities
`GET /api/cities` → `[City]`
`GET /api/cities/:slug` → `City`

### Spots
`GET /api/discovery/spots?page=1&limit=20&city=bengaluru&vibe=calm&category=park&travelerType=solo-travel`
`GET /api/discovery/spots/:id` → `Spot`

### Experiences
`GET /api/experiences?city=bengaluru&type=home-dinner&travelerType=foodie&priceRange=budget`
`GET /api/experiences/:id` → `Experience`
`GET /api/experiences/filters` → filter options

### Stories
`GET /api/stories?city=bengaluru&page=1&limit=20` → `[LocalStory]`
`POST /api/stories/` — create story
`POST /api/stories/:id/like` — like story

### Guides
`GET /api/guides` → `[CuratedGuide]`
`GET /api/guides/:citySlug` → `CuratedGuide`
`GET /api/cities/:citySlug/slow-guide` → slow guide data

### Search
`GET /api/search?q=query` → combined results

## Shared Data Models

### City
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ID |
| `name` | string | "Bengaluru" |
| `slug` | string | "bengaluru" |
| `state` | string | "Karnataka" |
| `description` | string | City description |
| `image` | string | Hero image URL |
| `spotCount` | number | Count of spots |
| `peacefulScore` | number | 0–10 |
| `tags` | string[] | ["gardens", "cafes"] |
| `knownFor` | string[] | ["Parks", "Food"] |
| `bestTimeToVisit` | string | "Oct–Mar" |
| `howToReach` | string | Transport info |
| `localTips` | string | Insider tips |

### Spot
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ID |
| `name` | string | Spot name |
| `slug` | string | URL-friendly name |
| `description` | string | Short description |
| `longDescription` | string | Full description |
| `images` | string[] | Image URLs |
| `city` | City (populated) | Parent city |
| `category` | string | "park", "cafe", "temple", etc. |
| `peaceScore` | number | 0–10 |
| `vibe` | string | "calm", "moderate", "lively" |
| `bestTime` | string | "morning", "sunset", etc. |
| `crowdLevel` | string | "peaceful", "moderate", "busy" |
| `entryFee` | string | "Free" or price |
| `timings` | string | Opening hours |
| `location` | `{ lat, lng, address }` | Geodata |
| `tags` | string[] | ["hidden-gem", "garden"] |
| `travelerTypes` | string[] | ["solo", "photography", ...] |
| `isTouristFriendly` | boolean | |
| `localStory` | string? | Local anecdote |
| `bestForTravelers` | string[] | |

### Experience
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | MongoDB ID |
| `name` | string | Experience name |
| `description` | string | Description |
| `images` | string[] | Gallery images |
| `city` | City (populated) | |
| `type` | string | "Home Dinner", "Workshop", "Heritage Walk", "Wellness", "Food Tour" |
| `category` | string | Subcategory |
| `priceRange` | string | "budget", "moderate", "premium" |
| `duration` | string | "3 hours", "Full day" |
| `languages` | string[] | ["English", "Hindi"] |
| `rating` | number | 0–5 |
| `hostName` | string | Host name |
| `hostContact` | string | Phone/email |
| `isVerified` | boolean | Verified by admin |
| `tags` | string[] | |
| `vibe` | string | |
| `timing` | string | When it runs |
| `travelerTypes` | string[] | |

### CuratedGuide
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | |
| `title` | string | "Slow Travel Bengaluru" |
| `citySlug` | string | "bengaluru" |
| `description` | string | Overview |
| `imageUrl` | string | Cover image |
| `duration` | string | "3 days" |
| `sections` | GuideSection[] | Day-wise itinerary |

### GuideSection
| Field | Type | Description |
|-------|------|-------------|
| `day` | number | 1, 2, 3 |
| `title` | string | "Morning in..." |
| `description` | string | Section details |
| `spots` | string[] | Spot IDs |
| `experiences` | string[] | Experience IDs |

### LocalStory
| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | |
| `title` | string | |
| `content` | string | Story text |
| `authorName` | string | |
| `authorImage` | string? | |
| `imageUrl` | string? | |
| `city` | City? | |
| `spot` | Spot? | Linked spot |
| `experience` | Experience? | Linked experience |
| `tags` | string[] | |
| `likeCount` | number | |
| `createdAt` | string | ISO date |

## Traveler Types
`slow-travel`, `photography`, `wellness`, `foodie`, `culture`, `adventure`, `solo-travel`, `digital-nomad`

## Experience Types
`Home Dinner`, `Workshop`, `Heritage Walk`, `Wellness`, `Food Tour`

## Vibe Values
`calm`, `moderate`, `lively`

## Crowd Levels
`peaceful`, `moderate`, `busy`

## Price Ranges
`budget`, `moderate`, `premium`
