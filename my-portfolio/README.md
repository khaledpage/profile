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
- **palettes**: 20+ Farbschemata (name, background, foreground, muted, card, cardContrast, accent1, accent2)
- **animation**: Hintergrund‑Gradient (rotateDurationSec, fadeDurationSec, fadeOutDurationSec, fadeInAfterSec, fadeMin, fadeMax, enabled)
- **colorRotation**: Automatischer Palettenwechsel (enabled, intervalSec, candidates)
- **i18n**: Basis‑Übersetzungen (nav/cta/common) mit defaultLocale und languages
- **interactiveEffects**: Dezente Maus‑Ripples (enabled, triggerChance, minIntervalSec, maxPerMinute, ripple.sizePx, ripple.durationMs, ripple.color)
- **settings**: Client‑seitige Einstellungen (enabled, showIcon, allowThemeChange, allowAnimationToggle, cookieConsent)
- **skillsDisplay**: Skills-Layout Konfiguration (design, availableDesigns, allowDesignChange)

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

Die Skills sind in `skills.json` konfiguriert und bieten **5 verschiedene Darstellungsformen**:

### Verfügbare Skill-Layouts

1. **Marquee** (Standard): Animierte Laufschrift mit Richtungswechsel pro Gruppe
2. **Grid**: Sauberes Raster-Layout mit Expand/Collapse-Funktionalität  
3. **Carousel**: Interaktive Slideshow mit Navigation
4. **Masonry**: Pinterest-Style mit variablen Höhen
5. **Timeline**: Chronologische Flusslinie mit Verbindungslinien

### Konfiguration

- **groups**: Array von Skill-Gruppen (frontend, backend, devops, etc.)
- **direction**: Scrollrichtung ("left" oder "right") - nur bei Marquee
- **speed**: Geschwindigkeit in px/s - nur bei Marquee  
- **items**: Array mit name, icon, description, proficiency

### Features

- **Real-time Layout-Wechsel**: Sofortige Änderung über Settings-Panel
- **Persistent Selection**: Gewähltes Layout wird gespeichert (mit Cookie-Zustimmung)
- **Responsive Design**: Alle Layouts funktionieren auf allen Bildschirmgrößen
- **Hover/Click Interaktionen**: Je nach Layout verschiedene Interaktionsmöglichkeiten

## Settings System

Das umfassende Einstellungssystem ermöglicht folgende Anpassungen:

### Theme & Farben

- **20+ Farbpaletten**: Von professionell bis lebendig, hell und dunkel
- **Sofortige Anwendung**: Themes wechseln ohne Seitenreload
- **Minimalist-Optionen**: Saubere, reduzierte Farbschemata

### Layout & Design

- **Skills-Layout Wahl**: 5 verschiedene Darstellungsformen
- **Animation Controls**: Hintergrundanimationen ein-/ausschalten
- **Real-time Updates**: Alle Änderungen sofort sichtbar

### Benutzerfreundlichkeit

- **Hintergrund-Klick schließt**: Panel schließt beim Klick außerhalb
- **Breiteres Panel**: Optimierte Breite für bessere Bedienbarkeit
- **GDPR-konform**: Cookie-Zustimmung für Speicherung der Einstellungen

Benutzer können über das Einstellungs-Icon (falls aktiviert) folgende Änderungen vornehmen:

- **Theme wechseln**: Aus 20+ verfügbaren Farbpaletten auswählen
- **Skills-Layout**: Zwischen Marquee, Grid, Carousel, Masonry und Timeline wählen
- **Animationen**: Ein-/Ausschalten der Hintergrundanimationen
- **Cookie-Consent**: DSGVO-konforme Speicherung der Präferenzen

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
