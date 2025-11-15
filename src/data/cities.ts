/**
 * Données des 20 grandes villes françaises
 *
 * Utilisé pour:
 * - Pages SEO /ville/[slug]
 * - Autocomplete dans CityInput
 * - Cron job de scraping multi-ville
 */

export interface City {
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  population: string;
  region: string;
  keywords: string[];
}

export const cities: City[] = [
  {
    slug: 'paris',
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    description: 'La capitale française regorge d\'activités sportives et intellectuelles. Des clubs d\'échecs aux salles de sport en passant par les bibliothèques et centres culturels, Paris offre une diversité inégalée d\'activités pour tous les passionnés.',
    population: '2,2 millions',
    region: 'Île-de-France',
    keywords: ['activités Paris', 'sport Paris', 'club échecs Paris', 'activités intellectuelles Paris', 'associations Paris']
  },
  {
    slug: 'marseille',
    name: 'Marseille',
    latitude: 43.2965,
    longitude: 5.3698,
    description: 'Deuxième ville de France, Marseille propose une grande variété d\'activités entre mer et ville. Sports nautiques, clubs de sport traditionnels et activités culturelles y cohabitent dans une atmosphère méditerranéenne unique.',
    population: '870 000',
    region: 'Provence-Alpes-Côte d\'Azur',
    keywords: ['activités Marseille', 'sport Marseille', 'club Marseille', 'associations Marseille', 'activités PACA']
  },
  {
    slug: 'lyon',
    name: 'Lyon',
    latitude: 45.7640,
    longitude: 4.8357,
    description: 'Lyon, capitale de la gastronomie, est aussi une ville dynamique pour les activités sportives et intellectuelles. Entre les berges du Rhône et les clubs historiques, découvrez une offre riche et variée.',
    population: '520 000',
    region: 'Auvergne-Rhône-Alpes',
    keywords: ['activités Lyon', 'sport Lyon', 'club Lyon', 'associations Lyon', 'activités Rhône-Alpes']
  },
  {
    slug: 'toulouse',
    name: 'Toulouse',
    latitude: 43.6047,
    longitude: 1.4442,
    description: 'La ville rose attire de nombreux passionnés d\'activités sportives et intellectuelles. Avec son climat ensoleillé et sa vie étudiante animée, Toulouse offre un cadre idéal pour pratiquer votre activité favorite.',
    population: '480 000',
    region: 'Occitanie',
    keywords: ['activités Toulouse', 'sport Toulouse', 'club échecs Toulouse', 'associations Toulouse', 'activités Occitanie']
  },
  {
    slug: 'nice',
    name: 'Nice',
    latitude: 43.7102,
    longitude: 7.2620,
    description: 'Nice, perle de la Côte d\'Azur, combine sports de plein air et activités culturelles. Entre la mer Méditerranée et les montagnes, profitez d\'une offre diversifiée d\'activités toute l\'année.',
    population: '340 000',
    region: 'Provence-Alpes-Côte d\'Azur',
    keywords: ['activités Nice', 'sport Nice', 'club Nice', 'associations Nice', 'activités Côte d\'Azur']
  },
  {
    slug: 'nantes',
    name: 'Nantes',
    latitude: 47.2184,
    longitude: -1.5536,
    description: 'Nantes, ville créative et dynamique, propose une scène sportive et culturelle très active. Des bords de Loire aux quartiers historiques, explorez les nombreuses activités disponibles.',
    population: '310 000',
    region: 'Pays de la Loire',
    keywords: ['activités Nantes', 'sport Nantes', 'club Nantes', 'associations Nantes', 'activités Pays de la Loire']
  },
  {
    slug: 'strasbourg',
    name: 'Strasbourg',
    latitude: 48.5734,
    longitude: 7.7521,
    description: 'Capitale européenne et ville dynamique, Strasbourg offre une richesse d\'activités entre tradition et modernité. Découvrez les clubs et associations dans cette ville au patrimoine exceptionnel.',
    population: '280 000',
    region: 'Grand Est',
    keywords: ['activités Strasbourg', 'sport Strasbourg', 'club Strasbourg', 'associations Strasbourg', 'activités Alsace']
  },
  {
    slug: 'montpellier',
    name: 'Montpellier',
    latitude: 43.6108,
    longitude: 3.8767,
    description: 'Montpellier, ville méditerranéenne jeune et ensoleillée, est parfaite pour les activités sportives et intellectuelles. Profitez du climat exceptionnel pour pratiquer votre passion toute l\'année.',
    population: '290 000',
    region: 'Occitanie',
    keywords: ['activités Montpellier', 'sport Montpellier', 'club Montpellier', 'associations Montpellier', 'activités Hérault']
  },
  {
    slug: 'bordeaux',
    name: 'Bordeaux',
    latitude: 44.8378,
    longitude: -0.5792,
    description: 'Bordeaux, ville du vin et du patrimoine, possède une scène sportive et culturelle florissante. Entre les quais rénovés et les parcs, découvrez une multitude d\'activités.',
    population: '250 000',
    region: 'Nouvelle-Aquitaine',
    keywords: ['activités Bordeaux', 'sport Bordeaux', 'club Bordeaux', 'associations Bordeaux', 'activités Gironde']
  },
  {
    slug: 'lille',
    name: 'Lille',
    latitude: 50.6292,
    longitude: 3.0573,
    description: 'Lille, capitale des Flandres, offre une vie associative très riche. Découvrez les nombreux clubs de sport et activités intellectuelles dans cette ville chaleureuse du Nord.',
    population: '230 000',
    region: 'Hauts-de-France',
    keywords: ['activités Lille', 'sport Lille', 'club Lille', 'associations Lille', 'activités Nord']
  },
  {
    slug: 'rennes',
    name: 'Rennes',
    latitude: 48.1173,
    longitude: -1.6778,
    description: 'Rennes, ville étudiante et dynamique, propose une grande diversité d\'activités sportives et culturelles. Explorez les clubs et associations dans cette capitale bretonne moderne.',
    population: '220 000',
    region: 'Bretagne',
    keywords: ['activités Rennes', 'sport Rennes', 'club Rennes', 'associations Rennes', 'activités Bretagne']
  },
  {
    slug: 'reims',
    name: 'Reims',
    latitude: 49.2583,
    longitude: 4.0317,
    description: 'Reims, ville du champagne et du patrimoine, offre une scène sportive et culturelle active. Découvrez les activités disponibles dans cette cité des sacres.',
    population: '180 000',
    region: 'Grand Est',
    keywords: ['activités Reims', 'sport Reims', 'club Reims', 'associations Reims', 'activités Champagne']
  },
  {
    slug: 'le-havre',
    name: 'Le Havre',
    latitude: 49.4944,
    longitude: 0.1079,
    description: 'Le Havre, ville portuaire au patrimoine UNESCO, propose des activités entre mer et ville. Sports nautiques et clubs traditionnels cohabitent dans cette cité normande.',
    population: '170 000',
    region: 'Normandie',
    keywords: ['activités Le Havre', 'sport Le Havre', 'club Le Havre', 'associations Le Havre', 'activités Normandie']
  },
  {
    slug: 'saint-etienne',
    name: 'Saint-Étienne',
    latitude: 45.4397,
    longitude: 4.3872,
    description: 'Saint-Étienne, ville industrielle reconvertie, offre de nombreuses activités sportives et culturelles. Découvrez les clubs dans cette ville au riche passé.',
    population: '170 000',
    region: 'Auvergne-Rhône-Alpes',
    keywords: ['activités Saint-Étienne', 'sport Saint-Étienne', 'club Saint-Étienne', 'associations Loire']
  },
  {
    slug: 'toulon',
    name: 'Toulon',
    latitude: 43.1242,
    longitude: 5.9280,
    description: 'Toulon, ville méditerranéenne militaire, propose une belle offre d\'activités entre mer et montagne. Profitez du climat ensoleillé pour pratiquer votre sport favori.',
    population: '170 000',
    region: 'Provence-Alpes-Côte d\'Azur',
    keywords: ['activités Toulon', 'sport Toulon', 'club Toulon', 'associations Var', 'activités PACA']
  },
  {
    slug: 'grenoble',
    name: 'Grenoble',
    latitude: 45.1885,
    longitude: 5.7245,
    description: 'Grenoble, capitale des Alpes, est un paradis pour les sportifs. Entre activités de montagne et clubs urbains, découvrez une offre exceptionnelle dans cette ville alpine.',
    population: '160 000',
    region: 'Auvergne-Rhône-Alpes',
    keywords: ['activités Grenoble', 'sport Grenoble', 'club Grenoble', 'associations Isère', 'sports montagne']
  },
  {
    slug: 'dijon',
    name: 'Dijon',
    latitude: 47.3220,
    longitude: 5.0415,
    description: 'Dijon, capitale de la Bourgogne, offre un cadre agréable pour les activités sportives et intellectuelles. Explorez les clubs dans cette ville au patrimoine remarquable.',
    population: '160 000',
    region: 'Bourgogne-Franche-Comté',
    keywords: ['activités Dijon', 'sport Dijon', 'club Dijon', 'associations Dijon', 'activités Bourgogne']
  },
  {
    slug: 'angers',
    name: 'Angers',
    latitude: 47.4784,
    longitude: -0.5632,
    description: 'Angers, ville verte aux bords de la Maine, propose une riche vie associative. Découvrez les nombreux clubs de sport et activités culturelles dans cette douceur angevine.',
    population: '150 000',
    region: 'Pays de la Loire',
    keywords: ['activités Angers', 'sport Angers', 'club Angers', 'associations Angers', 'activités Maine-et-Loire']
  },
  {
    slug: 'nimes',
    name: 'Nîmes',
    latitude: 43.8367,
    longitude: 4.3601,
    description: 'Nîmes, ville romaine du Sud, combine patrimoine antique et vie moderne. Profitez du climat méditerranéen pour pratiquer vos activités favorites toute l\'année.',
    population: '150 000',
    region: 'Occitanie',
    keywords: ['activités Nîmes', 'sport Nîmes', 'club Nîmes', 'associations Nîmes', 'activités Gard']
  },
  {
    slug: 'villeurbanne',
    name: 'Villeurbanne',
    latitude: 45.7667,
    longitude: 4.8794,
    description: 'Villeurbanne, commune de l\'agglomération lyonnaise, offre de nombreuses activités sportives et culturelles. Explorez les clubs dans cette ville dynamique limitrophe de Lyon.',
    population: '150 000',
    region: 'Auvergne-Rhône-Alpes',
    keywords: ['activités Villeurbanne', 'sport Villeurbanne', 'club Villeurbanne', 'associations Villeurbanne', 'activités Rhône']
  }
];

/**
 * Récupère une ville par son slug
 */
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug);
}

/**
 * Récupère toutes les villes triées par population (décroissant)
 */
export function getAllCities(): City[] {
  return cities;
}

/**
 * Récupère les villes principales (Top 10)
 */
export function getTopCities(limit: number = 10): City[] {
  return cities.slice(0, limit);
}

/**
 * Liste des villes pour l'autocomplete (nom + coordonnées uniquement)
 */
export interface CityOption {
  name: string;
  latitude: number;
  longitude: number;
}

export const cityOptions: CityOption[] = cities.map(city => ({
  name: city.name,
  latitude: city.latitude,
  longitude: city.longitude
}));
