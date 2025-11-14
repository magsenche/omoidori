# 📝 Aide-Mémoire : Commandes Essentielles - Omoidori

## 🔧 Installation Initiale

```bash
# 1. Installer les dépendances
cd omoidori
npm install

# 2. Lancer en développement local
npm run dev
# → Ouvrir http://localhost:5173
```

---

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Build + déploiement en une commande
npm run build
npx vercel

# Ou déploiement direct en production
npx vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Déploiement
npx netlify-cli deploy --prod
```

### Cloudflare Pages
```bash
# Via interface web (connecter le repo Git)
# Ou via CLI :
npm run build
npx wrangler pages deploy dist
```

---

## 🔧 Commandes de Développement

```bash
# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Installer une nouvelle dépendance
npm install nom-du-package

# Mettre à jour Supabase
npm update @supabase/supabase-js
```

---

## 🗄️ Configuration Supabase

### Créer la table entries
```sql
CREATE TABLE entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON entries
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON entries
  FOR INSERT WITH CHECK (true);

CREATE INDEX entries_date_idx ON entries(date);
```

### Politiques Storage
```sql
-- Lecture publique
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'omoidori-photos' );

-- Upload public
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'omoidori-photos' );
```

---

## 📝 Fichiers à Modifier

### 1. Configuration Supabase
**Fichier** : `src/App.jsx` (lignes 5-6)
```javascript
const supabaseUrl = 'https://xxxxx.supabase.co'   // ← Votre URL
const supabaseAnonKey = 'eyJhbGc...'              // ← Votre clé anon
```

### 2. Mot de Passe Admin
**Fichier** : `src/App.jsx` (ligne 18)
```javascript
const ADMIN_PASSWORD = 'omoidori2024'   // ← À changer
```

### 3. Personnalisation Couleurs
**Fichier** : `src/App.css` (ligne 7)
```css
background: linear-gradient(135deg, #ffa5d8 0%, #ff6b9d 50%, #c44569 100%);
```

---

## 🐛 Dépannage Express

### Erreur : "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Invalid API key"
```bash
# Vérifier que vous avez la bonne clé (anon public)
# Dans Supabase : Settings > API > anon public
```

### Le build échoue
```bash
# Nettoyer et rebuild
rm -rf dist
npm run build
```

### Problème de déploiement Vercel
```bash
# Forcer un nouveau déploiement
npx vercel --prod --force
```

### Les photos ne s'affichent pas
```bash
# 1. Vérifier dans Supabase que le bucket est PUBLIC
# 2. Vérifier les politiques storage (voir section SQL ci-dessus)
# 3. Tester l'URL d'une photo directement dans le navigateur
```

---

## 🔗 Liens Utiles

- **Supabase Dashboard** : https://app.supabase.com/
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Netlify Dashboard** : https://app.netlify.com/
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Vite** : https://vitejs.dev/

---

## 🆘 Diagnostic Rapide

**Test 1 : Le serveur local fonctionne ?**
```bash
npm run dev
# Si ça marche → problème de déploiement
# Si ça marche pas → problème de config
```

**Test 2 : La connexion Supabase fonctionne ?**
```javascript
// Ajoutez temporairement dans App.jsx après useEffect
console.log('Supabase URL:', supabaseUrl)
console.log('Entries loaded:', entries.length)
```

**Test 3 : L'upload fonctionne ?**
```bash
# Testez en mode admin local
# Regardez la console du navigateur (F12)
# Les erreurs y apparaîtront
```

---

## ✅ Checklist de Déploiement

Avant de déployer, vérifiez :
- [ ] Supabase configuré (table + bucket créés)
- [ ] Identifiants Supabase dans `App.jsx`
- [ ] Mot de passe admin changé
- [ ] `npm install` exécuté
- [ ] `npm run dev` fonctionne en local
- [ ] Upload d'une photo de test réussi
- [ ] `npm run build` s'exécute sans erreur
- [ ] Politiques Supabase configurées

---

## 🎯 Workflow Typique

```bash
# 1. Développer localement
npm run dev
# Éditez les fichiers dans src/

# 2. Tester l'upload
# Mode admin → Ajouter une photo

# 3. Si OK, builder
npm run build

# 4. Déployer
npx vercel

# 5. Partager l'URL ! 🌸
```

---

## 🔄 Mise à Jour du Site

```bash
# 1. Modifier le code localement
# (éditer src/App.jsx ou src/App.css)

# 2. Tester
npm run dev

# 3. Redéployer
npm run build
npx vercel --prod
```

---

## 📊 Requêtes SQL Utiles

### Voir toutes les photos
```sql
SELECT date, message, created_at FROM entries ORDER BY date;
```

### Compter les photos
```sql
SELECT COUNT(*) as total_photos FROM entries;
```

### Supprimer une photo spécifique
```sql
DELETE FROM entries WHERE id = 123;
```

### Supprimer toutes les photos (ATTENTION!)
```sql
TRUNCATE TABLE entries;
```

### Voir l'espace utilisé
```sql
SELECT pg_size_pretty(pg_database_size(current_database()));
```

---

## 🌸 Astuce : Raccourcis

```bash
# Alias pratiques à ajouter dans ~/.bashrc ou ~/.zshrc
alias omo-dev='cd ~/omoidori && npm run dev'
alias omo-build='cd ~/omoidori && npm run build'
alias omo-deploy='cd ~/omoidori && npm run build && npx vercel --prod'
```

Ensuite vous pourrez simplement taper :
```bash
omo-dev      # Lance le dev
omo-deploy   # Build et déploie
```

---

Gardez ce fichier à portée de main ! 📌

**Omoidori** - 思い出通り - *La rue des souvenirs* 🌸
