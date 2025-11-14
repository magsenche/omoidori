# 📊 Scripts SQL pour Supabase - Omoidori

Ce fichier contient tous les scripts SQL nécessaires pour configurer votre projet Supabase.

---

## 1️⃣ Créer la Table "entries"

**À exécuter dans : SQL Editor > New Query**

```sql
-- Créer la table pour stocker les photos et messages
CREATE TABLE entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security (sécurité au niveau des lignes)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire
CREATE POLICY "Enable read access for all users" ON entries
  FOR SELECT USING (true);

-- Politique : Tout le monde peut ajouter (à modifier plus tard si besoin)
CREATE POLICY "Enable insert access for all users" ON entries
  FOR INSERT WITH CHECK (true);

-- Index pour améliorer les performances des requêtes par date
CREATE INDEX entries_date_idx ON entries(date);
```

**✅ Résultat attendu** : "Success. No rows returned"

---

## 2️⃣ Politiques de Sécurité pour Storage

**À exécuter dans : SQL Editor > New Query**

```sql
-- Politique de lecture publique pour le bucket omoidori-photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'omoidori-photos' );

-- Politique d'écriture publique pour le bucket omoidori-photos
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'omoidori-photos' );
```

**⚠️ Remarque** : Exécutez ces politiques APRÈS avoir créé le bucket `omoidori-photos` dans l'interface Storage.

---

## 3️⃣ (Optionnel) Vérifier la Configuration

**Pour vérifier que tout est bien configuré :**

```sql
-- Voir toutes les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Voir les politiques sur la table entries
SELECT * FROM pg_policies WHERE tablename = 'entries';

-- Voir les politiques sur storage
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

---

## 4️⃣ (Optionnel) Ajouter une Photo de Test

**Pour tester que tout fonctionne :**

```sql
-- Insérer une photo de test
INSERT INTO entries (date, message, photo_url) 
VALUES (
  '2024-12-01',
  'Ceci est un message de test 🌸',
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800'
);

-- Vérifier l'insertion
SELECT * FROM entries;
```

**⚠️ Pour supprimer la photo de test :**
```sql
DELETE FROM entries WHERE message LIKE '%test%';
```

---

## 5️⃣ (Avancé) Sécuriser l'Écriture avec Authentification

**Si vous voulez que seuls les utilisateurs authentifiés puissent ajouter des photos :**

```sql
-- Supprimer l'ancienne politique d'insertion publique
DROP POLICY "Enable insert access for all users" ON entries;

-- Créer une nouvelle politique qui nécessite l'authentification
CREATE POLICY "Authenticated users can insert" ON entries
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Pareil pour le storage
DROP POLICY "Public Upload" ON storage.objects;

CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'omoidori-photos' );
```

**⚠️ Attention** : Si vous faites cela, vous devrez implémenter l'authentification Supabase dans votre code React !

---

## 6️⃣ (Avancé) Ajouter une Fonction pour Nettoyer les Anciennes Photos

**Pour supprimer automatiquement les photos de plus de 1 an :**

```sql
-- Créer une fonction de nettoyage
CREATE OR REPLACE FUNCTION cleanup_old_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM entries 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- (Optionnel) Créer un déclencheur pour l'exécuter automatiquement
-- Nécessite l'extension pg_cron (non disponible dans le plan gratuit)
```

---

## 7️⃣ (Utile) Requêtes de Diagnostic

**Pour débugger les problèmes :**

```sql
-- Compter le nombre d'entrées
SELECT COUNT(*) FROM entries;

-- Voir toutes les entrées triées par date
SELECT date, message, created_at FROM entries ORDER BY date;

-- Voir la taille utilisée dans la base de données
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Vérifier l'espace utilisé par la table entries
SELECT 
  pg_size_pretty(pg_total_relation_size('entries')) as table_size;
```

---

## 📝 Notes Importantes

### Configuration Minimale Requise
1. ✅ Table `entries` créée (script 1)
2. ✅ Bucket `omoidori-photos` créé (via interface UI)
3. ✅ Politiques storage (script 2)

### Configuration Recommandée
- Tous les scripts ci-dessus
- Test avec une photo de test (script 4)
- Vérification des politiques (script 3)

### Configuration Avancée (Optionnel)
- Authentification requise (script 5)
- Nettoyage automatique (script 6)

---

## 🆘 En Cas d'Erreur

### "permission denied for table entries"
→ Vérifiez que RLS est activé et que les politiques sont créées

### "permission denied for schema storage"
→ Assurez-vous d'avoir créé le bucket `omoidori-photos` AVANT d'exécuter les politiques storage

### "relation entries does not exist"
→ Exécutez d'abord le script 1 pour créer la table

---

## 💡 Astuce : Copier-Coller Rapide

Tous ces scripts sont prêts à être copiés-collés directement dans le SQL Editor de Supabase !

**Workflow recommandé :**
1. Script 1 → Run
2. Créer bucket via UI
3. Script 2 → Run
4. Script 4 (test) → Run
5. Vérifier dans l'app
6. Script 4 (delete test) → Run

**C'est tout !** 🌸
