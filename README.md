# ActivityAround 🏃‍♂️🧠

> Plateforme web pour découvrir et explorer les activités sportives et intellectuelles à Toulouse

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Application web Next.js recensant plus de **500 activités** sportives et intellectuelles disponibles à Toulouse. Carte interactive, blog SEO-optimisé, et scraping automatique quotidien.

## ✨ Fonctionnalités

### Pages principales
- 🏠 **Landing Page** : Hero avec 2 CTA (Recherche d'activités + Future app de rencontre)
- 🔍 **Recherche d'activités** : Carte interactive + filtres avancés par catégorie et quartier
- ⚽ **Pages catégories** : Sport / Intellectuel avec sous-catégories
- 📝 **Blog** : 4 articles SEO-optimisés (guides, top clubs, conseils débutants)
- ❓ **FAQ** : 10 Q&A avec schema FAQPage pour Google rich snippets
- 🗺️ **Pages quartiers** : Activités par neighbourhood

### Fonctionnalités techniques
- 📍 Carte interactive Leaflet.js avec géolocalisation
- 🔄 Scraping automatique quotidien via Vercel Cron Jobs (Google Places + OpenStreetMap)
- 🎨 Design moderne et minimaliste avec SCSS (architecture 7-1 + BEM)
- 📱 Interface 100% responsive (mobile, tablet, desktop)
- 🚀 SEO optimisé : schemas JSON-LD, sitemap dynamique, métadonnées complètes
- 🧭 Navigation Header/Footer sur toutes les pages
- 🎭 Animations Framer Motion

## 🛠 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Base de données**: PostgreSQL (Supabase) avec Prisma ORM
- **Styling**: SCSS (architecture 7-1, convention BEM)
- **Carte**: Leaflet.js + OpenStreetMap
- **Animations**: Framer Motion
- **Hébergement**: Vercel (plan hobby gratuit)
- **SEO**: JSON-LD schemas (Organization, LocalBusiness, BlogPosting, FAQPage)

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repo-url>
cd ActivityAround
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Puis remplir les valeurs dans `.env.local` :

**⚠️ IMPORTANT pour Supabase** : Deux URLs sont requises
- `DIRECT_URL`: Connexion directe (port 5432) pour migrations
- `DATABASE_URL`: Connexion poolée (port 6543) pour l'application
- `CRON_SECRET`: Secret pour sécuriser le cron job (générer avec `openssl rand -base64 32`)
- `GOOGLE_PLACES_API_KEY`: Clé API Google Places (optionnel)
- `NEXT_PUBLIC_BASE_URL`: URL de votre site déployé

4. **Initialiser la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Push le schéma vers la DB (utilise DIRECT_URL)
npm run db:push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de données

### Configuration locale avec PostgreSQL

Si vous n'avez pas PostgreSQL installé localement :

**Option 1: Docker**
```bash
docker run --name postgres-toulouse -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

**Option 2: Vercel Postgres (gratuit)**
1. Créer un projet sur Vercel
2. Ajouter Vercel Postgres
3. Copier la `DATABASE_URL` dans `.env.local`

**Option 3: Supabase (gratuit)**
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Récupérer l'URL de connexion PostgreSQL
3. La copier dans `.env.local`

### Gestion du schéma

```bash
# Push le schéma vers la DB
npm run db:push

# Générer le client Prisma
npm run db:generate

# Ouvrir Prisma Studio (GUI)
npm run db:studio
```

## 📂 Structure du projet

```
ActivityAround/
├── src/
│   ├── app/                         # Routes Next.js (App Router)
│   │   ├── layout.tsx               # Layout racine avec Header/Footer
│   │   ├── page.tsx                 # Landing page
│   │   ├── activites/               # Recherche d'activités avec carte
│   │   ├── sport/                   # Page catégorie sport
│   │   ├── intellectuel/            # Page catégorie intellectuel
│   │   ├── blog/                    # Blog index et articles
│   │   │   ├── page.tsx             # Liste des articles
│   │   │   └── [slug]/page.tsx     # Article individuel
│   │   ├── faq/                     # FAQ avec schema FAQPage
│   │   ├── quartier/[name]/         # Pages par quartier
│   │   ├── activity/[id]/[slug]/    # Détail activité SEO-friendly
│   │   ├── not-found.tsx            # 404 personnalisée
│   │   └── api/                     # API Routes
│   │       ├── activities/          # CRUD activités
│   │       └── cron/                # Cron jobs scraping
│   ├── components/                  # Composants React
│   │   ├── Header.tsx               # Navigation sticky
│   │   ├── Footer.tsx               # Footer 4 colonnes
│   │   ├── FAQ.tsx                  # Accordion Q&A
│   │   ├── ActivitiesMap.tsx        # Carte Leaflet
│   │   └── ...                      # Autres composants
│   ├── data/                        # Données statiques
│   │   └── blog-posts.ts            # Articles de blog TypeScript
│   ├── lib/                         # Utilitaires
│   │   ├── prisma.ts                # Instance Prisma
│   │   └── seo.ts                   # Helpers SEO et schemas JSON-LD
│   └── styles/                      # SCSS (architecture 7-1)
│       ├── abstracts/               # Variables, mixins
│       ├── base/                    # Reset, typography
│       ├── components/              # header.scss, footer.scss, etc.
│       ├── layout/                  # Layout styles
│       ├── pages/                   # home.scss, blog.scss, faq.scss, etc.
│       └── main.scss                # Point d'entrée
├── prisma/
│   └── schema.prisma                # Schéma DB (activities + reviews)
├── public/                          # Assets statiques
│   ├── sitemap.xml                  # Sitemap dynamique
│   └── robots.txt                   # Configuration crawlers
└── vercel.json                      # Configuration Vercel (cron)
```

## 🔄 Système de scraping

Le scraping est effectué automatiquement chaque jour à 3h du matin via Vercel Cron Jobs.

### APIs utilisées

1. **Google Places API** (40 000 requêtes/mois gratuites)
2. **Overpass API** (OpenStreetMap, illimité)

### Tester le scraping localement

```bash
# Créer un fichier .env.local avec CRON_SECRET
curl -X GET http://localhost:3000/api/cron/scrape-activities \
  -H "Authorization: Bearer your-cron-secret"
```

## 🚀 Déploiement sur Vercel

### 1. Préparer le repository GitHub

```bash
git init
git add .
git commit -m "Initial commit: ActivityAround v1.0"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com) et se connecter
2. Cliquer sur **"Add New Project"**
3. Importer votre repository GitHub
4. Configuration du projet :
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (laisser par défaut)
   - **Build Command**: `npm run build` (détecté automatiquement)
   - **Output Directory**: `.next` (détecté automatiquement)

### 3. Configurer les variables d'environnement

Dans Vercel Dashboard > Settings > Environment Variables, ajouter :

**⚠️ OBLIGATOIRES :**
```bash
DIRECT_URL="postgresql://USER:PASSWORD@HOST.supabase.co:5432/postgres"
DATABASE_URL="postgresql://USER:PASSWORD@HOST.supabase.co:6543/postgres?pgbouncer=true"
CRON_SECRET="your-secure-random-secret"
NEXT_PUBLIC_BASE_URL="https://your-site.vercel.app"
```

**Optionnels (pour le scraping) :**
```bash
GOOGLE_PLACES_API_KEY="your-api-key"
SERPAPI_KEY="your-serpapi-key"
MAPBOX_TOKEN="your-mapbox-token"
```

**Pour SEO (optionnels) :**
```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 4. Configurer Supabase (Base de données)

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Aller dans **Settings > Database**
4. Copier les deux chaînes de connexion :
   - **Connection string** (port 5432) → `DIRECT_URL`
   - **Connection pooling** (port 6543) → `DATABASE_URL`

### 5. Initialiser la base de données en production

Une fois déployé, initialiser le schéma :

**Option A : Via Vercel CLI**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Link au projet
vercel link

# Exécuter la migration
vercel env pull .env.production
npx prisma db push
```

**Option B : Via Supabase SQL Editor**
Copier-coller le schéma SQL généré par Prisma dans l'éditeur SQL Supabase.

### 6. Vérifier le déploiement

1. **Site web** : Vérifier que toutes les pages se chargent
   - `/` → Landing page
   - `/activites` → Recherche avec carte
   - `/blog` → Liste des articles
   - `/faq` → Questions fréquentes

2. **API** : Tester l'endpoint activities
   ```bash
   curl https://your-site.vercel.app/api/activities
   ```

3. **Cron Job** : Vérifier dans Vercel Dashboard > Cron Jobs
   - Le job `/api/cron/scrape-activities` doit apparaître
   - Schedule : `0 3 * * *` (tous les jours à 3h)

### 7. Post-déploiement SEO

1. **Google Search Console**
   - Ajouter votre site
   - Vérifier avec `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Soumettre le sitemap : `https://your-site.vercel.app/sitemap.xml`

2. **Google Analytics** (optionnel)
   - Créer une propriété GA4
   - Ajouter `NEXT_PUBLIC_GA_MEASUREMENT_ID`

3. **Tester les rich snippets**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Tester `/faq` (FAQPage schema)
   - Tester `/blog/[slug]` (BlogPosting schema)

### Troubleshooting déploiement

**Erreur "Prisma Client not found"**
```bash
# Ajouter postinstall script dans package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

**Erreur timeout sur build**
- Vérifier que `DATABASE_URL` est correctement configuré
- Les migrations Prisma utilisent `DIRECT_URL` automatiquement

**Cron job ne s'exécute pas**
- Vérifier que `vercel.json` est bien commité
- Le cron est protégé par `CRON_SECRET` (Vercel l'ajoute automatiquement)

## 📝 Scripts disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build pour production
npm run start        # Démarre le serveur de production
npm run lint         # Vérifie le code avec ESLint
npm run db:push      # Push le schéma Prisma vers la DB
npm run db:generate  # Génère le client Prisma
npm run db:studio    # Ouvre Prisma Studio
```

## 🎨 Guide de style SCSS

Le projet utilise l'architecture SCSS 7-1 et la convention de nommage BEM.

**Variables** : `src/styles/abstracts/_variables.scss`
```scss
$color-primary: #2563eb;
$spacing-md: 1rem;
$breakpoint-md: 768px;
```

**Mixins** : `src/styles/abstracts/_mixins.scss`
```scss
@include respond-to('md') {
  // Styles pour écrans ≥ 768px
}
```

## 🔐 Sécurité

- Les routes `/api/cron/*` sont protégées par `CRON_SECRET`
- Validation des données avec Zod
- Variables d'environnement pour les clés API
- `.env.local` est dans `.gitignore`

## 📊 Limites du plan gratuit

### Vercel
- 100 GB de bande passante/mois
- 100 heures de compute/mois
- Timeout fonction: 10s (hobby)

### Vercel Postgres
- 256 MB de stockage
- 60 heures de compute/mois

### Alternatives gratuites
- **Supabase**: 500 MB, 2 projets gratuits
- **Railway**: 500 MB, $5 de crédit gratuit/mois

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Leaflet.js](https://leafletjs.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

## 📄 Licence

MIT
