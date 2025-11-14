# 🚀 Guide de Démarrage Rapide - Omoidori (5 minutes)

## Étape 1 : Configuration Supabase (3 min)

### 1.1 Créer le projet
1. Allez sur https://supabase.com
2. Cliquez sur "New Project"
3. Nommez-le **"omoidori"**
4. Région : **Europe West** (ou la plus proche)
5. Mot de passe BDD : choisissez-en un (gardez-le quelque part)
6. Attendez 2 minutes ⏳

### 1.2 Créer la table (30 sec)
1. Cliquez sur **"SQL Editor"** dans le menu
2. Cliquez sur **"New Query"**
3. **Copiez-collez ce code** :

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

4. Cliquez sur **"Run"** (ou Ctrl+Enter)

### 1.3 Créer le bucket de stockage (30 sec)
1. Cliquez sur **"Storage"** dans le menu
2. Cliquez sur **"New bucket"**
3. Nom : `omoidori-photos`
4. **❗ IMPORTANT** : Décochez "Private bucket"
5. Cliquez sur "Create bucket"

### 1.4 Configurer les politiques de stockage (1 min)
1. Cliquez sur votre bucket **"omoidori-photos"**
2. Onglet **"Policies"**
3. Cliquez sur **"New policy"** deux fois et créez ces deux politiques :

**Politique 1 - Lecture publique :**
- Policy name : `Public Access`
- Allowed operation : `SELECT`
- Policy definition : Laissez `true`

**Politique 2 - Upload public :**
- Policy name : `Public Upload`
- Allowed operation : `INSERT`
- Policy definition : Laissez `true`

### 1.5 Récupérer les identifiants (30 sec)
1. Cliquez sur **"Settings"** (⚙️ en bas à gauche)
2. Cliquez sur **"API"**
3. **Copiez** :
   - **Project URL** → (ex: `https://xxxxx.supabase.co`)
   - **anon public key** → (la longue clé sous "Project API keys")

---

## Étape 2 : Configuration du Code (1 min)

### 2.1 Configurez les variables d'environnement
1. Créez un fichier `.env` à la racine du projet (copie de `.env.example`)
2. Remplacez les valeurs par vos identifiants Supabase :

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co        # ← Collez votre URL ici
VITE_SUPABASE_ANON_KEY=eyJhbGc...                  # ← Collez votre clé ici
```

### 2.2 Changez le mot de passe admin
Ouvrez `src/App.jsx` et modifiez la ligne 20 :
```javascript
const ADMIN_PASSWORD = 'VotreMotDePasse123'  // ← Changez ici
```

---

## Étape 3 : Installation (30 sec)

```bash
cd omoidori
npm install
```

---

## Étape 4 : Test Local (30 sec)

```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

**✅ Testez l'upload d'une photo en mode admin !**

---

## Étape 5 : Déploiement sur Vercel (1 min)

```bash
npm run build
npx vercel
```

Appuyez sur **Entrée** pour toutes les questions.

Vous obtiendrez une URL comme : `https://omoidori-xxx.vercel.app`

**🎉 Partagez cette URL avec vos amis !**

---

## 📝 Checklist Rapide

Avant de déployer, vérifiez :
- [ ] Table `entries` créée dans Supabase
- [ ] Bucket `omoidori-photos` créé et **PUBLIC**
- [ ] Politiques de stockage configurées (SELECT + INSERT)
- [ ] Fichier `.env` créé avec vos identifiants
- [ ] Mot de passe admin changé dans `App.jsx`
- [ ] `npm run dev` fonctionne en local
- [ ] Upload d'une photo de test réussi

---

## 🆘 Problèmes Fréquents

### ❌ Erreur : "Invalid API key"
→ Vérifiez que vous avez copié la bonne clé (anon public, pas service_role)

### ❌ Les photos ne s'affichent pas
→ Vérifiez que le bucket est **PUBLIC** (décoché "Private bucket")

### ❌ Erreur lors de l'upload
→ Vérifiez les politiques de stockage (onglet Policies dans le bucket)

### ❌ Table 'entries' n'existe pas
→ Retournez en SQL Editor et exécutez la requête CREATE TABLE

---

## 🎯 Utilisation Rapide

### Pour ajouter une photo :
1. Cliquez sur "Mode Admin"
2. Entrez le mot de passe
3. Remplissez le formulaire
4. Upload !

### Pour vos amis :
Ils visitent simplement l'URL et découvrent une nouvelle photo chaque jour ! 🌸

---

## 📞 Besoin d'Aide ?

**Problème avec Supabase ?**
- Documentation : https://supabase.com/docs
- Discord : https://discord.supabase.com

**Problème avec le déploiement ?**
- Vércel : https://vercel.com/docs
- Netlify : https://docs.netlify.com

---

C'est tout ! **Omoidori** est prêt ! 🌸

*思い出通り - La rue des souvenirs*
