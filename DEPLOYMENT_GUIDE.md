# 🚀 Guide de Déploiement - ActivityAround

Ce guide détaille toutes les étapes pour déployer ActivityAround en production sur Vercel avec Supabase.

**Date de création** : 2025-11-15
**Statut** : Ready for Production

---

## 📋 Prérequis

- [ ] Compte Vercel (gratuit)
- [ ] Compte Supabase (gratuit)
- [ ] Compte Google Cloud Platform (gratuit)
- [ ] Compte Google Search Console (gratuit)
- [ ] Compte Google Analytics (gratuit)
- [ ] Code poussé sur GitHub/GitLab

---

## 1️⃣ Configuration Google Places API

### Étape 1 : Créer le projet Google Cloud

1. Aller sur https://console.cloud.google.com/
2. Créer un nouveau projet : **"ActivityAround"**
3. Sélectionner le projet

### Étape 2 : Activer l'API Places

1. Menu > **APIs & Services** > **Library**
2. Chercher **"Places API"** (nouvelle version)
3. Cliquer sur **"Enable"**

### Étape 3 : Créer une clé API

1. Menu > **APIs & Services** > **Credentials**
2. Cliquer **"Create Credentials"** > **"API Key"**
3. Copier la clé générée

### Étape 4 : Restreindre la clé (SÉCURITÉ)

1. Cliquer sur la clé créée
2. **API restrictions** :
   - Sélectionner "Restrict key"
   - Cocher uniquement **"Places API"**
3. **Application restrictions** :
   - Sélectionner "HTTP referrers"
   - Ajouter :
     - `*.vercel.app/*`
     - `localhost:3000/*` (pour dev)
     - Votre domaine custom si applicable
4. **Sauvegarder**

### Étape 5 : Ajouter la clé en local

Créer/modifier `.env.local` :

```env
GOOGLE_PLACES_API_KEY=AIza...votre_clé_ici
```

### Étape 6 : Tester l'API en local

```bash
# Démarrer le serveur
npm run dev

# Tester la route de test
curl http://localhost:3000/api/test/cron-test
```

**Résultat attendu** :
```json
{
  "success": true,
  "city": "Paris",
  "results": {
    "overpass": { "count": 50, "sample": [...] },
    "googlePlaces": { "count": 30, "sample": [...] }
  },
  "total": 80,
  "duration": "3500ms"
}
```

**Quota gratuit** : 40,000 requêtes/mois
**Notre usage** : ~600 requêtes/mois (2 villes × 10 catégories × 30 jours)

---

## 2️⃣ Configuration Supabase (Base de données)

### Étape 1 : Créer le projet Supabase

1. Aller sur https://supabase.com/
2. Créer un nouveau projet : **"ActivityAround"**
3. Choisir la région : **Europe West (Paris)**
4. Définir un mot de passe fort pour la DB

### Étape 2 : Récupérer les URLs de connexion

1. Menu > **Settings** > **Database**
2. Copier les connexions :

**Connection Pooling (pour l'app)** :
```
postgresql://user:pass@host:6543/postgres?pgbouncer=true
```

**Direct Connection (pour Prisma migrations)** :
```
postgresql://user:pass@host:5432/postgres
```

### Étape 3 : Configurer les variables d'environnement locales

Dans `.env.local` :

```env
DATABASE_URL=postgresql://user:pass@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:pass@host:5432/postgres
```

### Étape 4 : Créer le schéma de la base de données

```bash
# Pousser le schéma Prisma vers Supabase
npx prisma db push

# Vérifier avec Prisma Studio
npx prisma studio
```

**Résultat attendu** :
- Table `activities` créée avec tous les champs
- Table `reviews` créée
- Indexes créés (category, subcategory, latitude/longitude)

### Étape 5 : Vérifier la capacité

**Limite gratuite Supabase** : 500 MB

**Estimation de consommation** :
- 1 activité ≈ 1-2 KB
- 10,000 activités ≈ 10-20 MB
- Marge confortable : **25x sous la limite**

**Monitorer** :
1. Dashboard Supabase > **Database** > **Database size**
2. Vérifier régulièrement après le scraping

---

## 3️⃣ Déploiement sur Vercel

### Étape 1 : Connecter le repository

1. Aller sur https://vercel.com/
2. Cliquer **"Add New Project"**
3. Importer votre repository GitHub/GitLab
4. Sélectionner le framework : **Next.js**

### Étape 2 : Configurer les variables d'environnement

Dans **Settings** > **Environment Variables**, ajouter :

**Database (Supabase)** :
```
DATABASE_URL=postgresql://...  (Pooled connection)
DIRECT_URL=postgresql://...     (Direct connection)
```

**APIs** :
```
GOOGLE_PLACES_API_KEY=AIza...
SERPAPI_KEY=...                 (optionnel)
CRON_SECRET=...                 (générer un secret aléatoire)
```

**Site Configuration** :
```
NEXT_PUBLIC_BASE_URL=https://votre-site.vercel.app
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...  (optionnel, voir étape 5)
NEXT_PUBLIC_GA_MEASUREMENT_ID=...         (optionnel, voir étape 4)
```

**Générer CRON_SECRET** :
```bash
# Dans un terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Étape 3 : Déployer

1. Cliquer **"Deploy"**
2. Attendre la build (~2-3 minutes)
3. Vérifier que le build réussit

**Vérifications post-déploiement** :
- [ ] Homepage accessible
- [ ] Pages `/activites`, `/ville/paris`, `/blog` fonctionnelles
- [ ] API `/api/activities` retourne des données (vide au début)
- [ ] Sitemap accessible : `/sitemap.xml`

### Étape 4 : Tester le cron job manuellement

Dans Vercel Dashboard :

1. **Settings** > **Cron Jobs**
2. Vérifier que le cron est configuré (doit apparaître automatiquement depuis `vercel.json`)
3. Pour tester manuellement :

```bash
# Appeler le cron avec le secret
curl -X GET "https://votre-site.vercel.app/api/cron/scrape-activities" \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

**Résultat attendu** :
```json
{
  "success": true,
  "count": 150,
  "cities": ["Paris", "Marseille"],
  "cityResults": {
    "Paris": 80,
    "Marseille": 70
  },
  "duration": "15000ms"
}
```

---

## 4️⃣ Configuration Google Analytics 4

### Étape 1 : Créer la propriété GA4

1. Aller sur https://analytics.google.com/
2. **Admin** > **Create Property**
3. Nom : **"ActivityAround"**
4. Fuseau horaire : **France**
5. Devise : **Euro (EUR)**

### Étape 2 : Créer un flux de données Web

1. **Admin** > **Data Streams** > **Add Stream** > **Web**
2. URL : `https://votre-site.vercel.app`
3. Nom : **"ActivityAround Web"**
4. Activer **Enhanced Measurement** (recommandé)

### Étape 3 : Récupérer le Measurement ID

Format : `G-XXXXXXXXXX`

### Étape 4 : Ajouter à Vercel

Dans **Environment Variables** :
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Étape 5 : Redéployer

Vercel va automatiquement redéployer avec la nouvelle variable.

### Étape 6 : Vérifier le tracking

1. Ouvrir votre site en production
2. Dans GA4 : **Reports** > **Realtime**
3. Vérifier qu'un utilisateur actif apparaît

**Note** : Le tracking Google Analytics est déjà implémenté dans le code (si la variable est définie).

---

## 5️⃣ Google Search Console

### Étape 1 : Ajouter la propriété

1. Aller sur https://search.google.com/search-console/
2. Cliquer **"Add Property"**
3. Sélectionner **"URL prefix"**
4. Entrer : `https://votre-site.vercel.app`

### Étape 2 : Vérifier la propriété

**Méthode 1 : Meta Tag (recommandé)**

1. Google fournit une balise meta :
   ```html
   <meta name="google-site-verification" content="XXXXX" />
   ```
2. Copier le `content="XXXXX"`
3. Ajouter dans Vercel Environment Variables :
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXX
   ```
4. Redéployer
5. Retourner sur Search Console et cliquer **"Verify"**

**Méthode 2 : DNS (si domaine custom)**

Ajouter un enregistrement TXT dans votre DNS.

### Étape 3 : Soumettre le sitemap

1. Dans Search Console, menu **Sitemaps**
2. Ajouter : `https://votre-site.vercel.app/sitemap.xml`
3. Cliquer **"Submit"**

**Vérification** :
- Statut : **Success**
- Pages découvertes : ~31+ pages (20 villes + 8 pages + blog)

### Étape 4 : Attendre l'indexation

- **Première indexation** : 1-3 jours
- **Indexation complète** : 1-2 semaines
- **Monitoring** : Vérifier régulièrement dans **Coverage** > **Valid**

---

## 6️⃣ Tests Post-Déploiement

### Checklist de vérification

**Fonctionnalités** :
- [ ] Homepage charge correctement
- [ ] Géolocalisation fonctionne (bannière + bouton GPS)
- [ ] Recherche par ville fonctionne (autocomplete)
- [ ] Slider de distance fonctionne
- [ ] Recherche retourne des activités (après premier cron)
- [ ] Carte interactive s'affiche
- [ ] Pages `/ville/[slug]` accessibles (20 villes)
- [ ] Pages blog accessibles (4 articles)
- [ ] FAQ fonctionne (accordion)

**SEO** :
- [ ] Sitemap accessible : `/sitemap.xml`
- [ ] Robots.txt accessible : `/robots.txt`
- [ ] Meta tags présentes (View Source)
- [ ] Open Graph tags présentes
- [ ] JSON-LD schemas présents

**Performance** :
- [ ] Lighthouse Score > 90 (Performance)
- [ ] Lighthouse Score > 95 (Accessibility)
- [ ] Lighthouse Score > 100 (SEO)
- [ ] Core Web Vitals : Vert

**Cron Job** :
- [ ] Cron job configuré dans Vercel
- [ ] Premier scraping réussi (tester manuellement)
- [ ] Données dans Supabase après scraping
- [ ] Rotation des villes fonctionne (vérifier logs)

---

## 7️⃣ Monitoring & Maintenance

### Monitoring quotidien (première semaine)

**Vérifier dans Vercel Dashboard** :
- Cron job s'exécute bien chaque jour à 3am
- Pas d'erreurs dans les logs
- Build time stable (~15-20s)

**Vérifier dans Supabase** :
- Nouvelles activités ajoutées quotidiennement
- Taille de la DB augmente modérément
- Pas d'erreurs de connexion

**Vérifier dans Google Analytics** :
- Trafic commence à arriver
- Pages vues augmentent
- Taux de rebond raisonnable (<70%)

### Monitoring hebdomadaire (après première semaine)

**Google Search Console** :
- Impressions augmentent
- Clicks commencent à arriver
- Positions moyennes s'améliorent
- Pas d'erreurs d'indexation

**Performance** :
- Core Web Vitals restent verts
- Temps de chargement stable
- Pas de timeout sur les API

**Base de données** :
- Taille DB sous 50 MB (large marge)
- Nombre d'activités : ~5,000-10,000 (objectif 1 mois)
- Pas de doublons excessifs

---

## 8️⃣ Optimisations Post-Launch (Optionnel)

### Court terme (1 mois)

- [ ] Ajouter plus d'articles de blog (10+)
- [ ] Créer des backlinks (annuaires locaux)
- [ ] Soumettre à Google My Business
- [ ] Optimiser les images (AVIF, WebP)

### Moyen terme (3 mois)

- [ ] Ajouter des pages subcategories (`/sport/echecs`)
- [ ] Implémenter le cache Redis (si trafic élevé)
- [ ] Newsletter inscription
- [ ] Social sharing amélioré

### Long terme (6+ mois)

- [ ] PWA complet (offline mode)
- [ ] App mobile (React Native)
- [ ] Lancer l'app de matching (objectif principal)

---

## 🆘 Troubleshooting

### Problème : Cron job échoue

**Causes possibles** :
- Google Places API quota dépassé → Vérifier dans GCP Console
- CRON_SECRET incorrect → Vérifier dans Vercel env vars
- Timeout (50s Vercel limit) → Réduire le nombre de catégories

**Solution** :
- Vérifier les logs Vercel
- Tester manuellement avec `curl`
- Réduire à 1 ville par jour si nécessaire

### Problème : Base de données pleine

**Causes** :
- Trop de doublons → Améliorer la déduplication
- Scraping trop agressif → Réduire la fréquence

**Solution** :
- Nettoyer les doublons en SQL
- Passer au plan payant Supabase ($25/mois = 8 GB)

### Problème : Pages ne s'indexent pas

**Causes** :
- Sitemap non soumis
- Robots.txt bloque les crawlers
- Contenu dupliqué

**Solution** :
- Vérifier `/robots.txt` : doit permettre les crawlers
- Soumettre manuellement les URLs dans Search Console
- Ajouter `rel="canonical"` sur les pages

---

## 📊 KPIs à suivre

### Semaine 1
- **Objectif** : Site stable, cron job fonctionne
- **Métriques** : 0 erreurs, 1,000+ activités scrapées

### Mois 1
- **Objectif** : Premières visites organiques
- **Métriques** : 100+ impressions/jour, 10+ clicks/jour, 5,000+ activités

### Mois 3
- **Objectif** : Trafic organique stable
- **Métriques** : 1,000+ impressions/jour, 50+ clicks/jour, Position moyenne <20

### Mois 6
- **Objectif** : Autorité SEO établie
- **Métriques** : 5,000+ impressions/jour, 200+ clicks/jour, Position moyenne <10

---

## ✅ Checklist finale avant lancement

**Pré-déploiement** :
- [ ] Build local réussit (`npm run build`)
- [ ] Toutes les variables d'environnement configurées
- [ ] Google Places API testée en local
- [ ] Base de données Supabase créée

**Déploiement** :
- [ ] Code poussé sur GitHub/GitLab
- [ ] Vercel connecté au repository
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Premier déploiement réussi

**Post-déploiement** :
- [ ] Toutes les pages accessibles
- [ ] Cron job testé manuellement
- [ ] Google Analytics tracking vérifié
- [ ] Sitemap soumis à Google Search Console
- [ ] Site vérifié dans Search Console

**Prêt pour le lancement** 🚀

---

**Dernière mise à jour** : 2025-11-15
**Maintenu par** : Équipe ActivityAround
