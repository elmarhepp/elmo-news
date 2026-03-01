# elmo-news — Projektanleitung für Claude

## Projektübersicht
News Feed Reader mit Nuxt 3 + Vue 3 + TypeScript.
Nutzer können sich registrieren, RSS-Feeds aktivieren/deaktivieren und eigene Feeds hinzufügen.

## Tech Stack
- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Auth**: nuxt-auth-utils (sealed HTTPOnly-Cookie-Sessions via `NUXT_SESSION_PASSWORD`)
- **Datenbank**: Prisma 6 (`prisma-client-js`) + PostgreSQL (Railway) / SQLite (lokal)
- **RSS**: rss-parser (Artikel werden live abgerufen, nicht in DB gespeichert)
- **Styling**: Tailwind CSS via `@nuxtjs/tailwindcss`
- **State**: Pinia (`@pinia/nuxt`)
- **Icons**: lucide-vue-next
- **Deployment**: Railway (Nixpacks)

## Wichtige Regeln

### Nuxt Server Auto-Imports
`server/utils/*.ts` wird von Nitro **automatisch** in alle Server-Routen importiert.
**NIEMALS** explizite relative Imports verwenden:
```typescript
// FALSCH — erzeugt doppelte Modul-Instanz:
import { prisma } from "../../../server/utils/db"

// RICHTIG — Nuxt auto-import:
const user = await prisma.user.findUnique(...)
```

### Prisma Generator
Immer `prisma-client-js` verwenden (nicht `prisma-client`):
```prisma
generator client {
  provider = "prisma-client-js"
}
```

### Auth-Pattern
```typescript
// Session setzen (Login/Register):
await setUserSession(event, { user: { id, email, name } })

// Session lesen (geschützte Routes):
const session = await getUserSession(event)
if (!session.user?.id) throw createError({ statusCode: 401 })

// Session löschen (Logout):
await clearUserSession(event)

// Client-seitig:
const { user, loggedIn } = useUserSession()
```

### E-Mail immer normalisieren
```typescript
const normalizedEmail = email.trim().toLowerCase()
```

## Dateistruktur

```
server/
  api/
    auth/
      login.post.ts       ← bcrypt + setUserSession
      logout.post.ts      ← clearUserSession
      register.post.ts    ← hash + create + auto-login
    feeds/
      index.get.ts        ← alle Feeds mit User-Status
      index.post.ts       ← Feed hinzufügen
      [id].patch.ts       ← Feed toggle (isActive)
    articles/
      index.get.ts        ← RSS live abrufen
  middleware/
    auth.ts               ← schützt /api/feeds + /api/articles
  utils/
    db.ts                 ← Prisma Singleton (auto-importiert)
    rss.ts                ← RSS Fetch + Parse
pages/
  index.vue               ← Hauptseite (Reader)
  login.vue
  register.vue
components/
  Sidebar.vue
  ArticleList.vue
  ArticleCard.vue
  AddFeedDialog.vue
middleware/
  auth.ts                 ← Client Route Guard → /login
prisma/
  schema.prisma
  seed.ts                 ← 5 Default-Feeds
```

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `DATABASE_URL` | PostgreSQL-URL (Railway) oder `file:./dev.db` (lokal) |
| `NUXT_SESSION_PASSWORD` | Min. 32 Zeichen, zufälliger String für Cookie-Verschlüsselung |

## Befehle (Makefile)

```bash
make dev          # Entwicklungsserver auf Port 3001
make build        # prisma generate && nuxt build
make db-migrate   # prisma migrate dev
make db-seed      # Seed mit Default-Feeds
make db-studio    # Prisma Studio
make db-reset     # DB komplett zurücksetzen + neu befüllen
make install      # npm install
make clean        # .nuxt + .output löschen
```

## Deployment (Railway)

```bash
# Build: prisma generate && nuxt build
# Start: prisma migrate deploy && node .output/server/index.mjs
```

- Service `Postgres` im gleichen Railway-Projekt
- `DATABASE_URL` wird intern referenziert (`postgres.railway.internal`)
- `NUXT_SESSION_PASSWORD` als Railway-Umgebungsvariable setzen

## Seed-Feeds (Standard)
- Heise Online
- Der Spiegel
- Hacker News
- The Verge
- t3n

## Bekannte Fallstricke
- `nitro.externals` NICHT setzen — verhindert bcryptjs vom Laden
- Nach Registrierung direkt einloggen (`setUserSession`) und zu `/` navigieren
- Middleware schützt `/api/feeds` und `/api/articles` (beide Pfadpräfixe)
