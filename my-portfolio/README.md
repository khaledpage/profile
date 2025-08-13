# Portfolio App – Setup & Konfiguration

Elegantes Next.js-Portfolio mit dynamischen Projektseiten, konfigurierbaren Farbpaletten, dezenter Hintergrundanimation und optionalen Interaktionseffekten.

## Stack

## Schnellstart
1. Abhängigkeiten installieren

```bash
npm install
```

2. Entwicklung starten

```bash
npm run dev
```

3. Build/Production

```bash
npm run build
npm start
```
Standard-URL: https://localhost:3000

## Inhalte & Konfiguration
Alle Inhalte liegen in `src/content/`:

Eine detaillierte Beschreibung der Konfigurationsfelder findest du zusätzlich in `src/content/CONFIGURATION.md`.

### `config.json` – Felder erklärt (Kurzfassung)
	- name, background, foreground, muted, card, cardContrast, accent1, accent2
	- rotateDurationSec: Rotationsdauer des Gradients
	- fadeDurationSec: legacy, symmetrische Fadedauer (falls genutzt)
	- fadeOutDurationSec: Ausblend-Dauer
	- fadeInAfterSec: Wartezeit bis zum erneuten Einblenden
	- fadeMin/fadeMax: Opazitätsbereich (0..1)
	- enabled: Animation an/aus
	- enabled, intervalSec, candidates (Paletten-Schlüssel)
	- defaultLocale, languages.nav|cta|common
	- enabled: an/aus
	- triggerChance: Wahrscheinlichkeit pro Ereignis (0..1)
	- minIntervalSec: Mindestabstand zwischen zwei Effekten
	- maxPerMinute: Limit pro Minute
	- ripple.sizePx, ripple.durationMs, ripple.color: Optik/Timing

Hinweis: `config.json` ist echtes JSON (keine Kommentare). Erklärungen stehen hier bzw. in `src/content/CONFIGURATION.md`.

## `projects.json` – Schema, Pflicht- und optionale Felder

Ein Projekt hat folgende Struktur (Kurzform):
	- title: string

	- description: string

	- image: string (Pfad unter `public/` z. B. `/images/project1.jpg`)

	- tags: string[]

	- link: string (allg. Projekt-/Externer Link)

	- featured?: boolean

	- overview?: string

	- techStack?: string[]
 
		- name, background, foreground, muted, card, cardContrast, accent1, accent2
		- rotateDurationSec: Rotationsdauer des Gradients
		- fadeDurationSec: legacy, symmetrische Fadedauer (falls genutzt)
		- fadeOutDurationSec: Ausblend-Dauer
		- fadeInAfterSec: Wartezeit bis zum erneuten Einblenden
		- fadeMin/fadeMax: Opazitätsbereich (0..1)
		- enabled: Animation an/aus
		- enabled, intervalSec, candidates (Paletten-Schlüssel)
		- defaultLocale, languages.nav|cta|common
		- enabled: an/aus
		- triggerChance: Wahrscheinlichkeit pro Ereignis (0..1)
		- minIntervalSec: Mindestabstand zwischen zwei Effekten
		- maxPerMinute: Limit pro Minute
		- ripple.sizePx, ripple.durationMs, ripple.color: Optik/Timing



		- title: string
		- description: string
		- image: string (Pfad unter `public/` z. B. `/images/project1.jpg`)
		- tags: string[]
		- link: string (allg. Projekt-/Externer Link)
		- featured?: boolean
		- overview?: string
		- techStack?: string[]
		- features?: string[]
		- challenges?: string[]
		- metrics?: { label: string; value: string }[]
		- meta?: { role?: string; duration?: string; year?: string; teamSize?: string }
		- gallery?: string[] (weitere Bildpfade)
		- links?: { live?: string; repo?: string; docs?: string }
