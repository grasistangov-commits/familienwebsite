# Liptow.net – privates Familien-Intranet

Ein privates Familienportal: Chat, Cloud-Speicher, Fotogalerie, Stammbaum,
Kalender, Wiki, Dokumentenarchiv, Kontakte, Aufgabenverwaltung und
Erinnerungs-Timeline – alles nur für eingeloggte Familienmitglieder
sichtbar.

## Tech-Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API-Routen
- **Datenbank:** PostgreSQL, Prisma ORM
- **Authentifizierung:** NextAuth (Credentials Provider, JWT-Sitzungen)
- **Dateispeicherung:** lokal auf dem Server (Docker-Volume), Auslieferung
  ausschließlich an eingeloggte Nutzer über eine eigene API-Route
- **Deployment:** Docker, docker-compose, vollständig kompatibel mit
  GitHub Codespaces

## Schnellstart mit GitHub Codespaces

1. Repository in GitHub öffnen → **Code → Codespaces → Create codespace on main**.
2. Codespaces baut automatisch den Dev-Container, startet PostgreSQL und
   führt `.devcontainer/post-create.sh` aus. Dabei werden:
   - `.env` aus `.env.example` erzeugt,
   - npm-Abhängigkeiten installiert,
   - das Datenbankschema angelegt (`prisma db push`),
   - der Administrator automatisch angelegt (Seed-Skript).
3. Im Terminal des Codespace:
   ```bash
   npm run dev
   ```
4. Codespaces leitet Port 3000 automatisch weiter und öffnet die
   Vorschau im Browser.

**Login (Testsystem):**

| Feld       | Wert                    |
|------------|-------------------------|
| E-Mail     | `admin@liptow.net`      |
| Passwort   | `Administrator123`      |

> Bitte das Passwort nach dem ersten Login über *Mein Profil* ändern.

## Lokale Ausführung mit Docker Compose (Produktion)

Für einen produktionsnahen Betrieb außerhalb von Codespaces:

```bash
cp .env.example .env
# .env anpassen, insbesondere NEXTAUTH_SECRET und die Postgres-Zugangsdaten!

docker compose up -d --build

# Einmalig: Datenbankschema anlegen und Administrator seeden
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

Die Anwendung ist danach unter `http://localhost:3000` erreichbar.

## Lokale Entwicklung ohne Docker

Voraussetzung: Node.js 20+ und eine erreichbare PostgreSQL-Datenbank.

```bash
cp .env.example .env
# DATABASE_URL in .env auf die eigene Postgres-Instanz anpassen

npm install
npx prisma db push
npm run db:seed
npm run dev
```

## Projektstruktur

```
src/
  app/
    login/                  Login-Seite (einzige öffentliche Seite)
    (dashboard)/             Geschützter Bereich mit Sidebar/Topbar
      dashboard/              Persönliches Dashboard
      chat/                   Familienchat
      cloud/                  Familien-Cloud (128 GB pro Nutzer)
      gallery/                Fotogalerie (Alben, Fotos, Kommentare)
      kalender/               Familienkalender
      stammbaum/              Interaktiver Stammbaum
      wiki/                   Familienwiki
      dokumente/              Dokumentenarchiv
      kontakte/               Kontaktverzeichnis
      aufgaben/               Aufgabenverwaltung (Kanban)
      timeline/               Erinnerungen / Familienchronik
      profil/                 Benutzerprofil
      administration/         Admin-Bereich (nur für Administratoren)
    api/                     API-Routen für alle Module
  components/               Wiederverwendbare UI-Komponenten
  lib/                      Prisma-Client, Auth-Konfiguration, Storage-Helfer
  middleware.ts             Schützt die gesamte Anwendung außer /login

prisma/
  schema.prisma            Vollständiges Datenbankmodell
  seed.ts                  Legt den Administrator automatisch an

.devcontainer/              GitHub-Codespaces-Konfiguration
docker-compose.yml          Produktions-Setup (Postgres + App)
Dockerfile                  Mehrstufiges Produktions-Image
```

## Benutzerverwaltung

- Neue Konten können **ausschließlich** vom Administrator im Bereich
  *Administration → Benutzerverwaltung* angelegt werden.
- Beim Anlegen wird ein **Einmalpasswort** erzeugt und angezeigt. Der
  Benutzer muss beim ersten Login (bzw. im Profilbereich) ein eigenes
  Passwort festlegen.
- Der Administrator kann Benutzer bearbeiten, sperren/entsperren,
  Passwörter zurücksetzen und Konten löschen.

## Sicherheit & Zugriff

- Ohne gültige Anmeldung ist **keine** Seite und **keine** API-Route
  erreichbar (siehe `src/middleware.ts`).
- Hochgeladene Dateien (Cloud, Galerie, Dokumente, Chat-Anhänge,
  Avatare) liegen außerhalb des öffentlichen `public/`-Verzeichnisses
  und werden nur über eine authentifizierte API-Route ausgeliefert.
- Passwörter werden ausschließlich als bcrypt-Hash gespeichert.

## Speicherlimits

Jeder Benutzer erhält 128 GB Cloud-Speicher (`storageQuotaBytes` in der
`User`-Tabelle). Ist das Limit erreicht, werden weitere Uploads
serverseitig blockiert. Der Administrator kann das Limit pro Benutzer
direkt in der Datenbank anpassen.

## Bekannte Grenzen dieser Version

- Der Familienchat aktualisiert sich per Polling (alle 4 Sekunden),
  nicht über WebSockets.
- Die Ordnerstruktur der Cloud unterstützt beliebige Verschachtelung im
  Datenmodell; die Oberfläche navigiert aktuell Ebene für Ebene.
- E-Mail-Versand (z. B. für neue Zugangsdaten) ist nicht enthalten –
  Zugangsdaten werden dem Administrator direkt in der Oberfläche
  angezeigt und müssen manuell weitergegeben werden.

Es sind keine echten personenbezogenen Daten in diesem Projekt
enthalten – alle Beispieldaten sind Platzhalter.
