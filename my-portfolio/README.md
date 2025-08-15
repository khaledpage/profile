# My Portfolio

Ein modernes Portfolio mit Next.js 15, React 19, TypeScript und Tailwind CSS v4.

## Stack

- **Next.js 15** (App Router)
- **React 19** mit TypeScript
- **Tailwind CSS v4** mit CSS-Variablen
- **Framer Motion** für Animationen
- **Heroicons** für Icons

## Schnellstart

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Entwicklung starten:

```bash
npm run dev
```

3. Build/Production:

```bash
npm run build
npm start
```

Standard-URL: `https://localhost:3000`

## Inhalte & Konfiguration

Alle Inhalte liegen in `src/content/`. Eine detaillierte Beschreibung der Konfigurationsfelder findest du zusätzlich in `src/content/CONFIGURATION.md`.

### `config.json` – Kurzüberblick

- **colorProfile**: Aktives Paletten‑Profil (Schlüssel in `palettes`)
- **palettes**: Farbschemata (name, background, foreground, muted, card, cardContrast, accent1, accent2)
- **animation**: Hintergrund‑Gradient (rotateDurationSec, fadeDurationSec, fadeOutDurationSec, fadeInAfterSec, fadeMin, fadeMax, enabled)
- **colorRotation**: Automatischer Palettenwechsel (enabled, intervalSec, candidates)
- **i18n**: Basis‑Übersetzungen (nav/cta/common) mit defaultLocale und languages
- **interactiveEffects**: Dezente Maus‑Ripples (enabled, triggerChance, minIntervalSec, maxPerMinute, ripple.sizePx, ripple.durationMs, ripple.color)
- **settings**: Client‑seitige Einstellungen (enabled, showIcon, allowThemeChange, allowAnimationToggle, cookieConsent)

Hinweis: `config.json` ist reines JSON (keine Kommentare).

### `projects.json` – Felder, optionales Verhalten

**Pflichtfelder je Projekt:**

- `title`: string
- `description`: string
- `image`: string (Pfad unter `public/`, z. B. `/images/project1.jpg`)
- `tags`: string[]
- `link`: string (allgemeiner/extern)

**Optionale Felder** (werden nur gerendert, wenn vorhanden):

- `featured?`: boolean
- `overview?`: string
- `techStack?`: string[]
- `features?`: string[]
- `challenges?`: string[]
- `metrics?`: { label: string; value: string }[]
- `meta?`: { role?: string; duration?: string; year?: string; teamSize?: string }
- `gallery?`: string[]
- `links?`: { live?: string; repo?: string; docs?: string }

**Fallback-Verhalten:**

- Fehlende optionale Felder werden übersprungen
- Leere Arrays werden nicht gerendert
- Falsche/fehlende `image`-Pfade zeigen Platzhalter
- Ungültige `link`-URLs werden deaktiviert

## Skills System

Die Skills sind in `skills.json` konfiguriert mit folgender Struktur:

- **groups**: Array von Skill-Gruppen (frontend, backend, devops, etc.)
- **direction**: Scrollrichtung ("left" oder "right")
- **speed**: Geschwindigkeit in px/s
- **items**: Array mit name, icon, description, proficiency

**Features:**

- Marquee-Animation mit Richtungswechsel pro Gruppe
- Hover pausiert die Animation
- Klick expandiert/kollabiert Details
- Responsive Design

## Settings System

Benutzer können über das Einstellungs-Icon (falls aktiviert) folgende Änderungen vornehmen:

- **Theme wechseln**: Aus verfügbaren Farbpaletten auswählen
- **Animationen**: Ein-/Ausschalten der Hintergrundanimationen
- **Cookie-Consent**: DSGVO-konforme Speicherung der Präferenzen

Die Einstellungen werden im `localStorage` gespeichert (mit Zustimmung) oder temporär gehalten.

## Projektstruktur

```text
src/
├── app/                 # Next.js App Router
├── components/          # React-Komponenten
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, Skills, etc.
│   └── ui/             # Wiederverwendbare UI-Elemente
├── content/            # JSON-Konfiguration
├── types/              # TypeScript-Definitionen
└── utils/              # Hilfsfunktionen
```

Weitere Details zur Konfiguration finden Sie in `src/content/CONFIGURATION.md`.
