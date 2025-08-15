# Konfigurationshandbuch (`src/content/config.json`)

Dieses Dokument erklärt die Felder der Konfigurationsdatei und deren Wirkung in der App.

## Top‑Level

- colorProfile (string)
  - Schlüssel einer Palette aus `palettes`, bestimmt das aktive Farbschema.
- palettes (Record<string, ColorPalette>)
  - Sammlung benannter Paletten.
  - ColorPalette: { name, background, foreground, muted, card, cardContrast, accent1, accent2 }
- animation (optional)
  - Steuert die Hintergrund‑Gradient‑Animation.
  - Felder:
    - rotateDurationSec (number): Rotationsdauer des Gradients (Sekunden).
    - fadeDurationSec (number): Legacy, symmetrische Fadedauer (nur falls genutzt).
    - fadeOutDurationSec (number): Dauer des Ausblendens.
    - fadeInAfterSec (number): Wartezeit bis zum erneuten Einblenden.
    - fadeMin (number 0..1): minimale Opazität.
    - fadeMax (number 0..1): maximale Opazität.
    - enabled (boolean): Animation an/aus.
- colorRotation (optional)
  - Automatischer Wechsel der Palette.
  - Felder:
    - enabled (boolean)
    - intervalSec (number): Wechselintervall.
    - candidates (string[]): Liste von Paletten‑Schlüsseln.
- i18n (optional)
  - Basistexte in mehreren Sprachen.
  - Felder:
    - defaultLocale (string)
    - languages (Record<string, { nav, cta, common }>):
      - nav: { about, projects, skills, contact }
      - cta: { talk }
      - common: { back, seeAlso }
- interactiveEffects (optional)
  - Dezente Maus‑Interaktion (Ripples) im Hintergrund.
  - Felder:
    - enabled (boolean): aktiviert/ deaktiviert den Effekt.
    - triggerChance (number 0..1): Wahrscheinlichkeit pro geeigneter Mausbewegung.
    - minIntervalSec (number): Mindestabstand zwischen zwei Ripples.
    - maxPerMinute (number): Oberlimit pro Minute.
    - ripple (optional):
      - sizePx (number): Basisgröße des Ripples.
      - durationMs (number): Animationsdauer in Millisekunden.
      - color (string): Farbgradient (leer = Standard über Paletten‑Akzentfarben).
- settings (optional)
  - Client‑seitige Einstellungen‑Oberfläche.
  - Felder:
    - enabled (boolean): aktiviert/deaktiviert das Einstellungssystem.
    - showIcon (boolean): zeigt/versteckt das Einstellungssymbol.
    - allowThemeChange (boolean): erlaubt Nutzern Farbpalettenwechsel.
    - allowAnimationToggle (boolean): erlaubt Nutzern Animationen ein‑/auszuschalten.
    - cookieConsent (boolean): zeigt Cookie‑Zustimmungsbanner für Speicherung von Präferenzen.

## Hinweise

- `config.json` ist reines JSON – Kommentare sind nicht erlaubt.
- Die App liest die Konfiguration beim Server‑Rendern ein; Änderungen erfordern i. d. R. ein Neuladen.
- Für Bilder sollten Pfade relativ zu `public/` mit führendem Slash verwendet werden (z. B. `/images/project1.jpg`).

## Skills‑Inhalte (`src/content/skills.json`)

Struktur:

```json
{
  "title": "Skills & Tooling",
  "groups": [
    { "key": "frontend", "title": "Frontend", "direction": "left", "speedSec": 40, "items": [
      { "name": "React", "level": "Expert", "years": 6, "description": "...", "tags": ["Hooks"], "link": "https://react.dev" }
    ]}
  ]
}
```

Felder:

- groups[].direction: "left" oder "right" – Richtung der langsamen Laufleiste.
- groups[].speedSec: Anzahl Sekunden für eine volle Schleife (je höher, desto langsamer).
- items: Einträge mit optionalen Details; auf Klick werden Details eingeblendet.
