.PHONY: dev build install clean db-migrate db-seed db-studio db-reset

# Entwicklungsserver (Port 3001)
dev:
	npm run dev

# Produktions-Build
build:
	npm run build

# Abhängigkeiten installieren
install:
	npm install

# Build-Artefakte löschen
clean:
	rm -rf .nuxt .output

# Datenbankmigrationen ausführen
db-migrate:
	npx prisma migrate dev

# Default-Feeds in DB eintragen
db-seed:
	npx tsx --env-file=.env prisma/seed.ts

# Prisma Studio öffnen
db-studio:
	npx prisma studio

# DB komplett zurücksetzen und neu befüllen
db-reset:
	npx prisma migrate reset --force
	npx tsx --env-file=.env prisma/seed.ts
