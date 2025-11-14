# 🌸 Omoidori (思い出通り)

**La rue des souvenirs** - Un site web pour partager des photos et messages jour par jour avec vos amis en voyage.

## ✨ Fonctionnalités

- 📅 **Photos datées** : Chaque photo est associée à une date spécifique
- 🔒 **Déblocage progressif** : Les photos ne sont visibles qu'à partir de leur date
- 👀 **Consultation rétroactive** : On peut revoir toutes les photos passées
- 🔧 **Interface admin** : Pour ajouter facilement de nouvelles photos
- 📱 **Responsive** : Fonctionne sur mobile, tablette et ordinateur
- 🎨 **Design japonisant** : Couleurs roses inspirées des cerisiers en fleurs

## 🚀 Installation

### 1. Prérequis
- Node.js installé (version 18 ou supérieure)
- Un compte Supabase (gratuit)

### 2. Configuration Supabase

#### a) Créer un projet Supabase
1. Allez sur [Supabase](https://supabase.com)
2. Cliquez sur "New Project"
3. Nommez-le "omoidori"
4. Choisissez une région proche (Europe West recommandé)
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
# Copiez .env.example vers .env
cp .env.example .env
```

2. **Remplacer les identifiants** dans `.env` :
```bash
VITE_SUPABASE_URL=https://VOTRE_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_ANON_KEY
```

3. **Changer le mot de passe admin** dans `src/App.jsx` (ligne 20) :
```javascript
const ADMIN_PASSWORD = 'omoidori2024' // Changez-le !
```

### 4. Installation des dépendances

```bash
cd omoidori
npm install
```

### 5. Test en local

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 📦 Déploiement Gratuit

### Option 1 : Vercel (Recommandé) ⭐

1. Créez un compte sur [Vercel](https://vercel.com)
2. Déployez :
```bash
npm run build
npx vercel
```

**URL** : Vous obtiendrez une URL comme `https://omoidori.vercel.app`

### Option 2 : Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Déployez :
```bash
npm run build
npx netlify-cli deploy --prod
```

**URL** : Vous obtiendrez une URL comme `https://omoidori.netlify.app`

### Option 3 : Cloudflare Pages

1. Créez un compte sur [Cloudflare Pages](https://pages.cloudflare.com)
2. Connectez votre dépôt Git
3. Configuration :
   - Build command: `npm run build`
   - Output directory: `dist`

## 📱 Utilisation

### Mode Visiteur (vos amis)
1. Partagez l'URL du site avec vos amis
2. Ils verront les photos débloquées jour par jour
3. Les photos futures apparaissent verrouillées 🔒
4. Les photos passées sont toutes accessibles

### Mode Admin (vous et les contributeurs)
1. Cliquez sur "Mode Admin" en bas de la page
2. Entrez le mot de passe (celui configuré dans le code)
3. Remplissez le formulaire :
   - **Date** : Quand la photo doit être débloquée
   - **Message** : Votre mot pour vos amis
   - **Photo** : Sélectionnez l'image
4. Cliquez sur "✨ Ajouter la photo"
5. C'est fait ! La photo apparaîtra automatiquement à la date choisie

## 🎨 Personnalisation

### Changer les couleurs
Éditez `src/App.css` (ligne 7) :
```css
background: linear-gradient(135deg, #ffa5d8 0%, #ff6b9d 50%, #c44569 100%);
/* Changez ces couleurs hex */
```

### Modifier les textes
Tous les textes sont dans `src/App.jsx` et facilement modifiables.

### Changer le mot de passe admin
Dans `src/App.jsx` (ligne 18).

## 🔒 Sécurité

### Niveau actuel : Bon pour usage privé
- Mot de passe dans le code
- URL privée partagée uniquement avec vos amis
- Bucket Supabase public (nécessaire pour l'affichage)

### Pour améliorer (si nécessaire)
1. **Utiliser Supabase Auth** pour de vrais comptes utilisateurs
2. **Sécuriser les politiques** pour n'autoriser que les utilisateurs authentifiés :

```sql
-- Lecture publique OK, mais écriture seulement si authentifié
CREATE POLICY "Authenticated users can insert"
ON entries FOR INSERT
TO authenticated
WITH CHECK (true);
```

## 💡 Conseils

- **Photos** : Compressez vos photos avant upload (max 2-3 MB recommandé)
- **Dates** : Utilisez le fuseau horaire de La Réunion pour les dates
- **Sauvegarde** : Supabase garde toutes vos données automatiquement
- **Partage** : L'URL reste la même, partagez-la une seule fois

## 🐛 Dépannage

### Les photos ne s'affichent pas
- Vérifiez que le bucket `omoidori-photos` est **public**
- Vérifiez les politiques de stockage (SELECT et INSERT)

### Erreur "Invalid API key"
- Vérifiez vos identifiants dans `src/App.jsx`
- Assurez-vous d'utiliser la clé `anon public` et non la clé `service_role`

### Erreur lors de l'upload
- Vérifiez que la table `entries` existe
- Vérifiez les politiques RLS (Row Level Security)

### Le site ne se déploie pas
- Vérifiez que `npm run build` fonctionne localement
- Lisez les logs d'erreur du service de déploiement

## 📊 Coûts Supabase (Plan Gratuit)

**Tout est GRATUIT** avec ces limites :
- 500 MB de base de données
- 1 GB de stockage fichiers
- 5 GB de transfert/mois
- 2 projets gratuits

**Pour votre usage** : Vous ne dépasserez jamais ces limites ! Un voyage de 2-3 semaines avec une photo par jour utilise moins de 100 MB.

## 🔄 Avantages de Supabase vs Firebase

✅ **Open source** : Code entièrement ouvert  
✅ **PostgreSQL** : Base de données SQL puissante  
✅ **Interface moderne** : Plus intuitive  
✅ **Pas de surprise** : Limites claires  
✅ **Temps réel** : Support WebSocket natif  
✅ **API REST** : Automatiquement générée  

## 📝 Structure du projet

```
omoidori/
├── src/
│   ├── App.jsx          # Composant principal avec Supabase
│   ├── App.css          # Styles japonisants
│   ├── main.jsx         # Point d'entrée React
│   └── index.css        # Styles globaux
├── index.html           # Page HTML principale
├── package.json         # Dépendances (Supabase inclus)
├── vite.config.js       # Configuration Vite
└── README.md           # Ce fichier
```

## 🎯 Roadmap potentielle

Fonctionnalités futures possibles :
- [ ] Authentification sécurisée avec Supabase Auth
- [ ] Commentaires sous les photos (avec temps réel)
- [ ] Notifications par email (via Supabase Edge Functions)
- [ ] Timeline interactive
- [ ] Export PDF de tout le voyage
- [ ] Mode hors ligne (PWA)
- [ ] Réactions emoji sur les photos

## 🤝 Support

Des questions ? Consultez :
1. [Documentation Supabase](https://supabase.com/docs)
2. [Guide SQL pour débutants](https://supabase.com/docs/guides/database/overview)
3. [Communauté Supabase Discord](https://discord.supabase.com)

---

Bon voyage à vos amis ! 🌴✈️

**Omoidori** - 思い出通り - *Créé avec ❤️*
