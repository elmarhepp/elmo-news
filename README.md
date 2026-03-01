# elmo-news

Persönlicher News Feed Reader gebaut mit Nuxt 3 und Vue 3.

## Features

- Registrierung und Login mit Email + Passwort
- Linke Sidebar mit allen verfügbaren RSS-Feeds
- Feeds aktivieren/deaktivieren per Toggle
- Eigene RSS-Feed-URLs hinzufügen
- Artikel live von RSS-Feeds geladen (nicht in DB gespeichert)
- 5 vorkonfigurierte Feeds (Heise, Spiegel, Hacker News, The Verge, t3n)

## Tech Stack

| Bereich     | Technologie                        |
|-------------|------------------------------------|
| Framework   | Nuxt 3 + Vue 3 + TypeScript        |
| Auth        | nuxt-auth-utils (sealed sessions)  |
| Datenbank   | Prisma + SQLite                    |
| RSS-Parsing | rss-parser                         |
| Styling     | Tailwind CSS                       |
| Icons       | lucide-vue-next                    |

## Projektstruktur

```
elmo-news/
├── server/
│   ├── api/
│   │   ├── auth/         # login, logout, register
│   │   ├── feeds/        # GET, POST, PATCH
│   │   └── articles/     # GET (live RSS-Fetch)
│   ├── middleware/       # Auth-Schutz für API-Routen
│   └── utils/            # Prisma-Singleton, RSS-Helper
├── pages/
│   ├── index.vue         # Reader (Hauptseite)
│   ├── login.vue
│   └── register.vue
├── components/
│   ├── Sidebar.vue
│   ├── ArticleList.vue
│   ├── ArticleCard.vue
│   └── AddFeedDialog.vue
├── middleware/
│   └── auth.ts           # Client-seitiger Route Guard
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

`.env` anpassen:

```env
DATABASE_URL="file:./dev.db"
NUXT_SESSION_PASSWORD="min-32-zeichen-langes-secret!!"
```

### 3. Datenbank einrichten

```bash
make db-migrate
make db-seed
```

### 4. Entwicklungsserver starten

```bash
make dev
```

App läuft auf [http://localhost:3001](http://localhost:3001)

## Makefile-Befehle

```bash
make dev          # Entwicklungsserver starten
make build        # Produktions-Build erstellen
make db-migrate   # Datenbankmigrationen ausführen
make db-seed      # Default-Feeds in DB eintragen
make db-studio    # Prisma Studio öffnen
make db-reset     # DB zurücksetzen und neu befüllen
make install      # Abhängigkeiten installieren
make clean        # Build-Artefakte löschen
```

## Datenmodell

```
User       id, email (unique), password (bcrypt), name?, createdAt
Feed       id, name, url (unique), description?, isDefault, createdAt
UserFeed   userId, feedId, isActive, addedAt   [PK: userId+feedId]
```

Artikel werden **nicht** in der Datenbank gespeichert — sie werden bei jedem Aufruf live von den RSS-URLs abgerufen.

## Verwandtes Projekt

[elmo-news-ts](../elmo-news-ts) — identische App mit Next.js 15 + React als Vergleich
