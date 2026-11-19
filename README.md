# Habitudes

Petite app de suivi d'habitudes : ajoute tes habitudes, coche les jours où tu les fais, suis ta série 🔥.

![CI](../../actions/workflows/ci.yml/badge.svg)

## Fonctionnalités

- Ajouter / supprimer des habitudes
- Cocher les 7 derniers jours
- Série en cours et record par habitude
- Compteur du jour
- Données sauvegardées sur l'appareil, sans compte
- Synchro optionnelle entre appareils via Supabase (connexion par lien magique)
- Mode sombre automatique, responsive mobile

## Stack

React 19 · TypeScript · Vite · Vitest + Testing Library · oxlint · Prettier · GitHub Actions

## Démarrer

```bash
npm install
npm run dev
```

## Synchro Supabase (optionnel)

1. Crée un projet sur [supabase.com](https://supabase.com)
2. SQL Editor : colle et exécute `supabase/schema.sql`
3. Authentication → URL Configuration : mets l'URL de l'app en _Site URL_
4. Copie `.env.example` en `.env.local` (dev) ou `.env.production` (build) avec l'URL et la clé publique

Sans ces variables, l'app fonctionne en mode local uniquement.

## Scripts

| Commande         | Rôle                       |
| ---------------- | -------------------------- |
| `npm run dev`    | Serveur de dev             |
| `npm test`       | Tests                      |
| `npm run lint`   | Lint                       |
| `npm run format` | Formatage                  |
| `npm run build`  | Build de prod dans `dist/` |

## Structure

```
src/
  lib/habits.ts        logique pure (séries, dates) + tests
  hooks/useHabits.ts   état + persistance localStorage
  components/          HabitForm, HabitRow
  App.tsx              écran principal (+ test d'intégration)
```

## CI / déploiement

- `ci.yml` : format, lint, tests, build à chaque push et PR
- `deploy.yml` : déploie sur GitHub Pages à chaque push sur `main`
  (activer dans _Settings → Pages → Source : GitHub Actions_)

## Licence

MIT
