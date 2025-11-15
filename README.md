# 🌋 Omoidori - Calendrier de l'Avent des Potes

Un calendrier interactif style Y2K/Web 1.0 pour partager des souvenirs avec vos amis éloignés.

## ✨ Fonctionnalités

- 📅 **Calendrier progressif** : Une photo se débloque chaque jour
- 🔒 **Photos verrouillées** : Les photos futures restent cachées jusqu'à leur date
- 👀 **Consultation rétroactive** : Revoir toutes les photos passées
- 🎨 **Design Y2K** : Interface style années 2000 avec effets néons et stickers flottants
- 📸 **Upload facile** : Interface d'administration intégrée
- 📱 **Responsive** : Fonctionne sur tous les appareils
- 🎭 **Stickers animés** : Photos de vos amis qui flottent en arrière-plan (chargés automatiquement)

## 🚀 Installation

### 1. Prérequis
- Node.js installé (version 18 ou supérieure)
- Un compte Supabase (gratuit)

### 2. Configuration Supabase

#### a) Créer un projet Supabase
1. Allez sur [Supabase](https://supabase.com)
2. Cliquez sur "New Project"
3. Nommez-le "omoidori"
4. Choisissez une région proche
5. Définissez un mot de passe pour la base de données
6. Attendez que le projet soit créé (~2 minutes)

#### b) Créer la table "entries"
1. Dans votre projet Supabase, allez à "SQL Editor"
2. Cliquez sur "New Query"
3. Copiez et exécutez ce SQL :

```sql
-- Créer la table entries
CREATE TABLE entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tout le monde
CREATE POLICY "Enable read access for all users" ON entries
  FOR SELECT USING (true);

-- Permettre l'écriture à tout le monde (à sécuriser plus tard si besoin)
CREATE POLICY "Enable insert access for all users" ON entries
  FOR INSERT WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX entries_date_idx ON entries(date);
```

#### c) Créer le bucket de stockage
1. Allez dans "Storage" dans le menu Supabase
2. Cliquez sur "New bucket"
3. Nommez-le : `omoidori-photos`
4. **Décochez** "Private bucket" (le bucket doit être public)
5. Cliquez sur "Create bucket"

#### d) Configurer les politiques de stockage
1. Cliquez sur votre bucket `omoidori-photos`
2. Allez dans "Policies"
3. Ajoutez ces deux politiques :

**Politique de lecture (SELECT) :**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'omoidori-photos' );
```

**Politique d'écriture (INSERT) :**
```sql
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'omoidori-photos' );
```

#### e) Récupérer les identifiants
1. Allez dans "Settings" > "API"
2. Copiez :
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (la clé publique)

### 3. Configuration du projet

1. **Créer le fichier `.env`** à la racine du projet :
```bash
VITE_SUPABASE_URL=https://VOTRE_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_ANON_KEY
```

### 4. Installation des dépendances

```bash
npm install
```

### 5. Test en local

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 📦 Déploiement

### Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Installez Vercel CLI : `npm i -g vercel`
3. Déployez :
```bash
npm run build
vercel
```

**Important** : Ajoutez vos variables d'environnement dans les paramètres Vercel :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🎨 Personnalisation

### Ajouter des stickers d'amis

Les stickers se chargent **automatiquement** ! Il suffit de :
1. Placer vos photos PNG dans `/public/stickers/`
2. Nommer les fichiers (ex: `prenom.png`)
3. Elles apparaîtront automatiquement en arrière-plan

## 📱 Utilisation

### Mode Visiteur (vos amis)
1. Partagez l'URL du site
2. Ils verront les photos débloquées jour par jour
3. Les photos futures apparaissent verrouillées 🔒
4. Cliquer sur une photo pour la voir en grand

### Mode Upload (contributeurs)
1. Cliquez sur "➕ AJOUTER UN SOUVENIR"
2. Remplissez le formulaire :
   - **Date** : Choisissez la date de déblocage (date picker natif)
   - **Message** : Votre mot pour les amis
   - **Photo** : Sélectionnez l'image
3. Cliquez sur "🚀 ENVOYER LA PHOTO ! 🚀"
4. La photo apparaîtra automatiquement à la date choisie

**Note** : Pas de système de mot de passe dans cette version. L'URL de l'interface d'upload doit être gardée privée.

## 🎯 Fonctionnalités Techniques

### Design Y2K / Web 1.0
- Effets néons et ombres colorées
- Polices "Comic Sans MS" et "Impact"
- Bordures pixelisées style Windows 95
- Curseurs personnalisés
- Texte défilant (marquee)
- Stickers animés flottants
- Scan lines rétro sur les photos
- Animations flash et bounce

## 🔒 Sécurité

### Niveau actuel : Usage privé
- Pas d'authentification (interface simple)
- URL gardée secrète entre contributeurs
- Bucket Supabase public (nécessaire pour l'affichage)
- Politiques RLS basiques sur Supabase

### Pour améliorer (production)
1. **Ajouter un mot de passe** pour l'interface d'upload
2. **Utiliser Supabase Auth** pour de vrais comptes
3. **Sécuriser les politiques RLS** :

```sql
-- Lecture publique OK, mais écriture seulement si authentifié
CREATE POLICY "Authenticated users can insert"
ON entries FOR INSERT
TO authenticated
WITH CHECK (true);
```

## 💡 Conseils

- **Photos** : Compressez vos images (max 2-3 MB)
- **Stickers** : Utilisez des PNG avec fond transparent
- **Dates** : Attention au fuseau horaire (utilisez celui de vos amis)
- **Backup** : Supabase sauvegarde automatiquement


## 📝 Structure du projet

```
omoidori/
├── public/
│   └── stickers/          # Photos d'amis (PNG) chargées automatiquement
├── src/
│   ├── App.jsx            # Composant principal
│   ├── App.css            # Styles Y2K/Web 1.0
│   ├── FloatingStickers.jsx   # Stickers animés (auto-load)
│   ├── FloatingStickers.css
│   ├── BonusEffects.jsx   # Effets visuels bonus
│   ├── main.jsx
│   └── index.css
├── .env                   # Variables Supabase (à créer)
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Roadmap

Fonctionnalités possibles :
- [ ] Système de mot de passe simple pour l'upload
- [ ] Authentification Supabase Auth
- [ ] Commentaires sous les photos
- [ ] Réactions emoji
- [ ] Sons rétro au clic

## 🤝 Support

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vite](https://vitejs.dev)
- [Discord Supabase](https://discord.supabase.com)
