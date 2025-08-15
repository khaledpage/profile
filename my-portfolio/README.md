# My Portfolio

Ein modernes Portfolio mit Next.js 15, React 19, TypeScript und Tailwind CSS v4.

## Stack

- **Next.js 15** (App Router)
- **React 19** mit TypeScript
- **Tailwind CSS v4** mit CSS-Variablen
- **Framer Motion** für Animationen
- **Heroicons** für Icons
- **KaTeX** für LaTeX-Mathematik-Rendering
- **remark/rehype** für Markdown-Processing
- **gray-matter** für Frontmatter-Parsing

## Schnellstart

1. Abhängigkeiten installieren:

```bash
npm install
```

**Hinweis:** Alle benötigten Dependencies für das Article System (KaTeX, remark/rehype, gray-matter) sind bereits in der package.json enthalten.

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

## Neue Features

### 🍪 Cookie Consent System

**DSGVO-konformes Cookie-Management:**

- **Kategorisierte Zustimmung**: Necessary, Analytics, Preferences, Marketing
- **Intelligente Speicherung**: Verhindert Speicherung ohne Zustimmung
- **365-Tage Gültigkeit**: Automatisches Ablaufen der Zustimmung
- **Re-Prompt Mechanismus**: Erneute Nachfrage bei Settings-Änderungen ohne Zustimmung
- **Theme-Integration**: Konsistente Darstellung mit Portfolio-Design

**Features:**

- Accept All / Customize / Reject Workflows
- Detaillierte Kategorie-Erklärungen
- Automatische Integration mit Settings-Panel
- localStorage-basierte Persistierung

### 📝 Article System

**Vollständiges Content-Management-System:**

- **Markdown + LaTeX**: Wissenschaftliche Artikel mit mathematischen Formeln
- **Flexible Assets**: Lokale Bilder und Internet-Links unterstützt
- **Rich Metadata**: Tags, Kategorien, Featured-Status, SEO-Optimierung
- **Responsive Design**: Optimierte Darstellung auf allen Geräten

**Dateistruktur pro Artikel:**

```text
src/content/articles/[article-slug]/
├── article.md          # Hauptinhalt (Markdown + LaTeX)
├── metadata.json       # Meta-Informationen
└── assets/            # Lokale Bilder und Dateien
    ├── cover.jpg
    └── diagram.png
```

**Features:**

- **LaTeX-Rendering**: KaTeX-Integration für mathematische Formeln
- **Theme-aware Styling**: Konsistente Farbgebung mit Portfolio
- **Static Generation**: Optimierte Performance durch ISR
- **SEO-Optimierung**: OpenGraph, Meta-Tags, strukturierte Daten
- **Navigation Integration**: Nahtlose Einbindung in Website-Navigation
- **Filtering System**: Featured Articles, Kategorien, Tags
- **Reading Experience**: Optimierte Typografie und Lesbarkeit

**Artikel erstellen:**

1. Neuen Ordner unter `src/content/articles/` erstellen (z.B. `my-new-article`)

2. `metadata.json` mit folgendem Schema erstellen:

```json
{
  "title": "Artikel Titel",
  "summary": "Kurze Beschreibung des Artikels",
  "publishedAt": "2024-01-15",
  "coverImage": "/images/cover.jpg",
  "tags": ["react", "javascript"],
  "category": "tutorial",
  "featured": false,
  "published": true,
  "readingTime": 5,
  "author": "Dein Name"
}
```

3. `article.md` mit Markdown-Inhalt erstellen:

```markdown
# Artikel Titel

Einleitung des Artikels...

## LaTeX Formeln

Inline Mathe: $E = mc^2$

Display Mathe:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

![Lokales Bild](./assets/diagram.png)
```

4. Optional: `assets/` Ordner für lokale Bilder erstellen

### `config.json` – Kurzüberblick

- **colorProfile**: Aktives Paletten‑Profil (Schlüssel in `palettes` oder `paletteGroups`)
- **paletteGroups**: Neue gruppierte Farbschemata (dark, light, vibrant) mit je 4-6 Themes
- **palettes**: Legacy-Unterstützung für ungroupierte Farbschemata
- **animation**: Hintergrund‑Gradient mit sofortiger Ein-/Ausschaltung (rotateDurationSec, fadeDurationSec, fadeOutDurationSec, fadeInAfterSec, fadeMin, fadeMax, enabled)
- **colorRotation**: Automatischer Palettenwechsel (enabled, intervalSec, candidates)
- **i18n**: Basis‑Übersetzungen (nav/cta/common) mit defaultLocale und languages
- **interactiveEffects**: Dezente Maus‑Ripples (enabled, triggerChance, minIntervalSec, maxPerMinute, ripple.sizePx, ripple.durationMs, ripple.color)
- **settings**: Client‑seitige Einstellungen (enabled, showIcon, allowThemeChange, allowAnimationToggle, allowLanguageChange, cookieConsent)
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

### Cookie Consent & Privacy

- **DSGVO-Compliance**: Kategorisierte Cookie-Zustimmung (Necessary, Analytics, Preferences, Marketing)
- **Intelligent Storage**: Verhindert Speicherung ohne Benutzer-Zustimmung
- **Re-Prompt System**: Automatische Nachfrage bei Settings-Änderungen ohne Consent
- **365-Tage Gültigkeit**: Automatisches Ablaufen der Zustimmung nach einem Jahr
- **Graceful Degradation**: Volle Funktionalität auch ohne Cookie-Akzeptanz

### Theme & Farben

- **Gruppierte Farbpaletten**: Themes organisiert in 3 Kategorien (Dark, Light, Vibrant)
- **16+ Farbpaletten**: Erweiterte Auswahl mit harmonischen Farbkombinationen
- **Verbesserte Farbharmonie**: Professionelle Kontraste und ästhetische Akzentfarben
- **6+ Light Themes**: Cloud White, Warm Cream, Soft Blue, Mint Green, Lavender, Peach
- **6+ Dark Themes**: Indigo Purple, Ocean Blue, Emerald Forest, Sunset Orange, Rose Gold, Midnight Purple
- **4+ Vibrant Themes**: Neon Cyber, Electric Pink, Acid Green, Sunburst Yellow
- **Sofortige Anwendung**: Themes wechseln ohne Seitenreload

### Layout & Design

- **Skills-Layout Wahl**: 5 verschiedene Darstellungsformen
- **Sprachauswahl**: Dynamischer Wechsel zwischen Deutsch und Englisch
- **Animationssteuerung**: Background-Animationen ein-/ausschaltbar

### Sprachsystem

- **Echtzeit-Wechsel**: Sofortiger Sprachwechsel ohne Seitenreload
- **Mehrsprachiger Content**: Navigation, Hero-Bereich und UI-Texte
- **API-basiert**: Dynamisches Laden von sprachspezifischen Inhalten
- **Fallback-Mechanismus**: Graceful degradation bei fehlenden Übersetzungen
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
- **Sprache**: Dynamischer Wechsel zwischen Deutsch und Englisch
- **Cookie-Consent**: DSGVO-konforme Speicherung der Präferenzen

Die Einstellungen werden im `localStorage` gespeichert (mit Zustimmung) oder temporär gehalten.

## Projektstruktur

```text
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   │   ├── articles/   # Article data endpoints
│   │   └── hero-content/ # Localized content
│   ├── articles/       # Article pages
│   │   ├── page.tsx    # Article listing
│   │   └── [slug]/     # Individual articles
│   └── projects/       # Project pages
├── components/          # React-Komponenten
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, Skills, Articles, etc.
│   └── ui/             # Wiederverwendbare UI-Elemente
│       ├── ArticleCard.tsx      # Article preview cards
│       ├── CookieConsent.tsx    # GDPR cookie banner
│       ├── MarkdownRenderer.tsx # LaTeX + Markdown
│       └── SettingsPanel.tsx    # Theme & preferences
├── content/            # JSON-Konfiguration & Articles
│   ├── articles/       # Article content
│   │   ├── [slug]/     # Individual article folders
│   │   │   ├── article.md      # Markdown content
│   │   │   ├── metadata.json   # Article metadata
│   │   │   └── assets/         # Local images
│   ├── config.json     # Main configuration
│   ├── projects.json   # Project data
│   └── skills.json     # Skills showcase
├── types/              # TypeScript-Definitionen
│   ├── article.ts      # Article & metadata types
│   └── content.ts      # Content configuration
└── utils/              # Hilfsfunktionen
    ├── articles.ts     # Article data utilities
    ├── content.ts      # Content loading
    ├── cookies.ts      # Cookie consent management
    └── i18n.ts         # Internationalization
```

Weitere Details zur Konfiguration finden Sie in `src/content/CONFIGURATION.md`.
