# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14+ web application (using App Router) that catalogs sports and intellectual activities across France. The site automatically scrapes activity data via Vercel Cron Jobs and displays clubs/associations on an interactive map based on user geolocation.

**Target deployment**: Vercel (free hobby plan)
**Database**: PostgreSQL (Supabase free tier - 500 MB storage)
**UI Framework**: Tailwind CSS + Shadcn/ui + Custom SCSS

### 🎯 Project Mission & Strategy

**ActivityAround is a SEO-focused discovery platform** designed to:
1. **Generate organic traffic** by ranking on "activities + location" keywords (multi-city SEO strategy)
2. **Help users find activities** around their geographic area using geolocation (sports, intellectual, cultural)
3. **Tease the upcoming app** - A separate matching platform (visible on homepage CTA "Rencontres autour d'activités - Coming Soon")

**What ActivityAround IS**:
- ✅ A comprehensive activity catalog for major French cities (Paris, Lyon, Marseille, Toulouse, etc.)
- ✅ A geolocation-based search and discovery tool (map, distance slider, city autocomplete)
- ✅ An SEO powerhouse to build organic visibility (generic + city-specific pages)
- ✅ A traffic generation funnel for the future matching app

**What ActivityAround is NOT**:
- ❌ A user authentication platform (that's for the future app)
- ❌ A matching/meetup platform (that's for the future app)
- ❌ A social network (that's for the future app)

**Relationship with Future App**:
- ActivityAround = Public discovery site (no login required)
- Future App = Members-only platform where users create accounts, find activities, AND meet people to share them with
- Strategy: Build SEO authority now → Drive qualified traffic to future app later

## Key Technical Constraints

### Styling Requirements
- **Primary**: **Tailwind CSS** - Use Tailwind utility classes for all styling
- **Secondary**: **Shadcn/ui components** - Built on Radix UI + Tailwind
- **Tertiary**: **Custom SCSS** - Only for complex layouts or animations not achievable with Tailwind
- **Design System**: Indigo primary (#6366F1), Cyan accent (#06B6D4), Inter font family
- Follow 7-1 SCSS architecture pattern for custom styles (abstracts/, base/, components/, layout/, pages/)
- Complete reference: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

### Architecture Requirements
- **Next.js App Router** (NOT Pages Router)
- Server Components by default
- Client Components only when necessary (mark with 'use client')
- API Routes must be in `app/api/` directory
- TypeScript strict mode required

## Database Schema

```sql
activities (
  id, name, category (sport/intellectual), subcategory,
  address, postal_code, city,
  phone, email, website,
  latitude, longitude,
  schedule (JSONB),
  description (TEXT),        # Enhanced content for SEO
  opening_hours (JSONB),     # OpeningHoursSpecification schema
  neighborhood (VARCHAR),    # For geographic filtering (deprecated multi-ville)
  created_at, updated_at
)

reviews (
  id, activity_id (FK),
  author_name, rating (1-5), comment,
  created_at, updated_at
)
```

Indexes: `category`, `subcategory`, `[latitude, longitude]` (composite for geolocation)

### Prisma Configuration (Supabase)

**IMPORTANT**: Supabase requires two database URLs:
- `DATABASE_URL` - Pooled connection (port 6543) for application runtime
- `DIRECT_URL` - Direct connection (port 5432) for migrations/db push

```env
# Direct connection for migrations (use this for prisma db push, prisma migrate, etc.)
DIRECT_URL="postgresql://user:password@host:5432/postgres"
# Pooled connection for application (better for serverless)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
```

## Development Commands

```bash
# Development
npm run dev              # Start development server

# Database (Prisma)
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Prisma Studio GUI

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## Key Features & Implementation

### 1. Multi-City Geolocation System (✅ Implemented)

**User Flow** (`/activites` page):
1. **Geolocation banner** prompts user to allow GPS
2. **Two options**:
   - Use GPS location (browser geolocation API)
   - Manual city input (autocomplete with 20 French cities)
3. **Distance slider** (5km - 100km)
4. **Search button** triggers `/api/activities/nearby`
5. **Results** displayed with distance badges on cards
6. **Interactive map** centers on user location with blue marker

**Key Components**:
- `useGeolocation` hook ([src/hooks/useGeolocation.ts](src/hooks/useGeolocation.ts))
- `CityInput` component ([src/components/CityInput.tsx](src/components/CityInput.tsx))
- `/api/activities/nearby` route (Haversine distance formula)
- `ActivitiesMap` with user location marker ([src/components/ActivitiesMap.tsx](src/components/ActivitiesMap.tsx))

### 2. Multi-City Data Scraping System (✅ Implemented)

**Cron Job**: `/api/cron/scrape-activities`
- **Schedule**: Daily at 3am (configured in `vercel.json`)
- **Strategy**: Scrapes 2 cities per day in rotation (Top 10 French cities)
- **Cycle**: Complete coverage every 5 days
- **Radius**: 20km around city center
- **Authentication**: Protected with `CRON_SECRET`

**Data Sources**:
- Google Places API (40,000 free requests/month)
- Overpass API (OpenStreetMap - unlimited but rate-limited)
- SerpAPI (optional, if configured)

**Rotation Logic**:
- Day 1: Paris, Marseille
- Day 2: Lyon, Toulouse
- Day 3: Nice, Nantes
- Day 4: Strasbourg, Montpellier
- Day 5: Bordeaux, Lille
- Repeat...

**City Data**: [src/data/cities.ts](src/data/cities.ts) - 20 French cities with GPS coordinates and SEO metadata

### 3. SEO Multi-City Pages (✅ Implemented)

**City Landing Pages**: `/ville/[slug]`
- 20 static pages generated (SSG with `generateStaticParams`)
- Hero section with city name and region
- Stats (population, region, activities count)
- Sport/Intellectual category cards
- CollectionPage JSON-LD schema
- Breadcrumb navigation
- SEO-optimized metadata per city

**Cities Available**: Paris, Marseille, Lyon, Toulouse, Nice, Nantes, Strasbourg, Montpellier, Bordeaux, Lille, Rennes, Reims, Le Havre, Saint-Étienne, Toulon, Grenoble, Dijon, Angers, Nîmes, Villeurbanne

### 4. Required Environment Variables

```
DATABASE_URL                          # PostgreSQL pooled connection
DIRECT_URL                            # PostgreSQL direct connection
CRON_SECRET                           # Vercel cron job authentication
GOOGLE_PLACES_API_KEY                 # Google Places API key (optional)
SERPAPI_KEY                           # SerpAPI key (optional)
NEXT_PUBLIC_BASE_URL                  # Base URL (e.g., https://activityaround.vercel.app)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION  # Google Search Console (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID         # Google Analytics (optional)
```

## Page Structure

### Home Page (`/`)
- Hero with 2 CTAs: "Recherche d'activités" + "Rencontres" (coming soon)
- Features section (4 benefits)
- Stats section
- Final CTA

### Activities Search (`/activites`)
- **Geolocation banner** (if permission not granted)
- **Hero** with title and subtitle
- **Location card**:
  - GPS button or City autocomplete
  - Distance slider (5-100km)
  - Search button
- **Results section**:
  - Category filter
  - Activity cards with distance badges
  - Sticky map with user marker
- **Empty states**: No activities, no search results, error

### City Pages (`/ville/[slug]`)
- Hero with city name and region badge
- Stats (population, region, activities)
- Sport/Intellectual category cards
- CTA section

### Activity Detail (`/activity/[id]/[slug]`)
- Breadcrumb navigation
- Gradient hero
- 2-column layout (info + sidebar)
- Contact cards
- Quick action buttons
- Reviews section (if available)

### Category Pages (`/sport`, `/intellectuel`)
- Landing pages for main categories
- Subcategories list
- SEO-optimized content

### Blog (`/blog`, `/blog/[slug]`)
- 4 articles (Toulouse-specific, kept for SEO)
- Grid layout with category badges
- BlogPosting JSON-LD schema

### FAQ (`/faq`)
- 10 Q&A pairs
- Accordion component
- FAQPage JSON-LD schema

### Custom 404 (`/not-found`)
- 4 suggestion cards
- CTAs to main sections

## Component Architecture

### Core Components
- **Header** ([src/components/Header.tsx](src/components/Header.tsx)) - Sticky nav with mobile menu
- **Footer** ([src/components/Footer.tsx](src/components/Footer.tsx)) - 4-column layout with city links
- **ActivitiesMap** ([src/components/ActivitiesMap.tsx](src/components/ActivitiesMap.tsx)) - Leaflet.js map with user marker
- **ActivityCardShadcn** ([src/components/ActivityCardShadcn.tsx](src/components/ActivityCardShadcn.tsx)) - Modern card with distance badge
- **CityInput** ([src/components/CityInput.tsx](src/components/CityInput.tsx)) - Autocomplete with 20 cities
- **CategorySelect** ([src/components/CategorySelect.tsx](src/components/CategorySelect.tsx)) - Shadcn Select wrapper

### Hooks & Utilities
- **useGeolocation** ([src/hooks/useGeolocation.ts](src/hooks/useGeolocation.ts)) - GPS and permissions management
- **/lib/seo.ts** - SEO utilities (metadata, JSON-LD generation)
- **/lib/scrapers/** - Scraping modules (Overpass, Google Places, SerpAPI)

### Data Files
- **/data/cities.ts** - 20 French cities (coordinates, metadata)
- **/data/blog-posts.ts** - 4 blog articles
- **/data/faq.ts** - FAQ data

## SEO Optimization

### Implemented Features
- **Dynamic Sitemap** (`/sitemap.xml`) - Auto-generated, revalidates hourly
- **Robots.txt** (`/robots.txt`) - Optimized for crawlers
- **JSON-LD Schemas**:
  - Organization (all pages)
  - LocalBusiness (activity pages)
  - CollectionPage (city pages, category pages)
  - FAQPage (FAQ page)
  - BlogPosting (blog posts)
  - Breadcrumb navigation
- **SEO-Friendly URLs**: `/activity/[id]/[slug]`, `/ville/[slug]`
- **Dynamic Metadata**: Titles, descriptions, OG tags, Twitter Cards
- **Performance**: Image optimization, compression, security headers

### Post-Deployment Checklist
1. Configure `NEXT_PUBLIC_BASE_URL` in Vercel
2. Add site to Google Search Console
3. Submit sitemap (`/sitemap.xml`)
4. Create Google Business Profile
5. Monitor Core Web Vitals

## Project Status

**Last Updated**: 2025-11-15 (Phase 3 Complete)
**Status**: ✅ **Ready for Production Deployment**

### ✅ PHASE 1: Foundation & Infrastructure (100%)
- Next.js 14+, TypeScript, Prisma, Supabase
- Tailwind CSS + Shadcn/ui
- SCSS architecture
- Security headers

### ✅ PHASE 2: Backend & Data Layer (100%)
- API routes (activities, nearby search)
- Multi-city scrapers (Overpass, Google Places, SerpAPI)
- Cron job with rotation system
- Haversine distance calculation

### ✅ PHASE 3: Core Frontend & UI (100%)
- 31 routes compiled successfully
- 8 main pages + 20 city pages + 4 blog articles
- Geolocation system (GPS + city autocomplete)
- Distance slider (5-100km)
- Interactive map with user marker
- Responsive design (mobile-first)

### ✅ PHASE 4: SEO & Performance (100%)
- Dynamic sitemap
- 6 JSON-LD schema types
- SEO-optimized metadata
- Core Web Vitals optimized

### ✅ PHASE 5: Animations & Polish (100%)
- Framer Motion integration
- Gradient backgrounds
- Hover animations
- Loading states

### Future Improvements (Optional)
- **Content**: More blog articles (16+ needed for target of 20)
- **SEO**: Subcategory landing pages (`/sport/echecs`, etc.)
- **Features**: Activity comparison, social sharing, newsletter
- **Technical**: PWA, Analytics, Lazy loading optimization
- **SCSS**: Migrate `@import` to `@use`, `darken()` to `color.scale()`

## Troubleshooting

### Prisma Issues
- **"Cannot read properties of undefined (reading 'bind')"**: Run `npx prisma generate`
- **"Column does not exist"**: Run `npx prisma db push`
- **"EPERM" (Windows)**: Close dev server, run `npx prisma generate`, restart

### Supabase Connection
- **Migrations hang**: Use `DIRECT_URL` (port 5432) for `prisma db push`

### Build Issues
- **SASS warnings**: Non-critical deprecation warnings (migrate to `@use` and `color.scale()` later)
- **TypeScript errors**: Ensure Next.js 15+ async params pattern is used

## Notes

- The project targets a 100% free hosting solution (Vercel + Supabase free tiers)
- All scraping respects API rate limits (Google Places: 40,000/month)
- Map uses OpenStreetMap (free tier)
- Focus on clean, maintainable code with proper separation of concerns
- Blog articles on Toulouse are kept for SEO (local strategy)

---

## 📝 Recent Session Work (2025-11-15)

### ✅ PHASE 3 COMPLETED - Multi-Ville & SEO

**Major Achievements**:

1. **City Data System** ([src/data/cities.ts](src/data/cities.ts))
   - 20 French cities with GPS coordinates
   - SEO metadata (description, population, region, keywords)
   - Helper functions: `getCityBySlug()`, `getTopCities()`, `cityOptions`

2. **City Landing Pages** ([src/app/ville/[slug]/page.tsx](src/app/ville/[slug]/page.tsx))
   - 20 SSG pages generated
   - Hero + stats + category cards
   - CollectionPage JSON-LD schema
   - Breadcrumb navigation

3. **ActivitiesMap Enhancement** ([src/components/ActivitiesMap.tsx](src/components/ActivitiesMap.tsx))
   - Blue user marker (separate from activity markers)
   - Auto-center on user or activity center of gravity
   - `userCoordinates` prop support

4. **Multi-City Scraping** ([src/app/api/cron/scrape-activities/route.ts](src/app/api/cron/scrape-activities/route.ts))
   - Rotation system (2 cities/day, 5-day cycle)
   - `getCitiesToScrapeToday()` function
   - Top 10 cities prioritized
   - Detailed logging per city

5. **Scraper Updates**
   - [overpass.ts](src/lib/scrapers/overpass.ts): Accepts lat/lng/cityName
   - [googlePlaces.ts](src/lib/scrapers/googlePlaces.ts): Accepts lat/lng/cityName
   - [serpApi.ts](src/lib/scrapers/serpApi.ts): Already compatible

6. **CityInput Refactor** ([src/components/CityInput.tsx](src/components/CityInput.tsx))
   - Uses centralized `cityOptions` from cities.ts
   - No more hardcoded data

**Build Results**:
- ✅ 31 routes compiled (16.7s)
- ✅ 20 city pages generated via SSG
- ✅ 0 TypeScript errors
- ⚠️ 18 SASS warnings (non-critical)

**Next Steps**:
- Deploy to Vercel
- Configure environment variables
- Test cron job in production
- Submit sitemap to Google Search Console
