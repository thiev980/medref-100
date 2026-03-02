# MedRef CH 🏥

**Interaktive medizinische Referenz für die Schweiz & Mitteleuropa**

Die 100 häufigsten Beschwerden mit Medikamenten, Wirkstoffen, Dosierungen und ICD-10 Codes.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## Features

- **🔍 Bidirektionale Suche** – Beschwerde → Medikament _und_ Wirkstoff → Beschwerde
- **📂 Kategorie-Browser** – 16 farbcodierte medizinische Fachgebiete
- **📄 100 Einzelseiten** – Jede Beschwerde mit eigener, SEO-optimierter URL
- **🧪 Detail-Ansichten** – Ursachen, Behandlung, Medikamente, Wirkstoffe, Dosierung
- **🔎 SEO-optimiert** – SSG, Structured Data (JSON-LD), Open Graph, Sitemap
- **🇨🇭 Schweiz-spezifisch** – Schweizer Medikamentennamen, BAG-Empfehlungen, ICD-10

## Tech Stack

| Technologie | Zweck |
|---|---|
| **Next.js 14** | SSG (Static Site Generation), Routing, SEO |
| **React 18** | UI-Komponenten, State Management |
| **next-sitemap** | Automatische Sitemap- und robots.txt-Generierung |
| **Vercel** | Hosting, CI/CD, Edge Network |

## Projektstruktur

```
medref-ch/
├── data/
│   └── conditions.js       # Alle 100 Beschwerden mit Medikamenten
├── components/
│   └── SEOHead.js           # Wiederverwendbare SEO-Komponente
├── pages/
│   ├── _app.js              # App-Wrapper
│   ├── _document.js         # HTML-Dokument mit Fonts & Meta
│   ├── index.js             # Hauptseite (Suche + Kategorie-Browser)
│   └── beschwerden/
│       └── [slug].js        # Dynamische Einzelseiten (SSG)
├── styles/
│   └── globals.css          # Globale Styles
├── next.config.js           # Next.js Konfiguration
├── next-sitemap.config.js   # Sitemap-Konfiguration
└── package.json
```

## Lokale Entwicklung

```bash
# 1. Dependencies installieren
npm install

# 2. Entwicklungsserver starten
npm run dev

# 3. Browser öffnen
# → http://localhost:3000
```

## Deployment auf Vercel

### Option A: Über GitHub (empfohlen)

1. Repository auf GitHub pushen
2. [vercel.com](https://vercel.com) → "Import Project"
3. GitHub-Repo auswählen
4. "Deploy" klicken – fertig!

Vercel erkennt Next.js automatisch und konfiguriert alles.

### Option B: Über Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Einmalig einloggen
vercel login

# Deployen
vercel

# Production Deploy
vercel --prod
```

### Umgebungsvariable (optional)

Für korrekte Canonical-URLs in Production:

```
NEXT_PUBLIC_SITE_URL=https://deine-domain.vercel.app
```

## SEO-Features im Detail

| Feature | Implementation |
|---|---|
| **SSG** | Alle 100+ Seiten werden beim Build als statisches HTML generiert |
| **Structured Data** | JSON-LD `MedicalCondition` Schema auf jeder Beschwerdeseite |
| **Open Graph** | Titel, Beschreibung, URL für Social Media Sharing |
| **Sitemap** | Automatisch generiert via `next-sitemap` |
| **Canonical URLs** | Auf jeder Seite gesetzt |
| **Semantisches HTML** | `<header>`, `<main>`, `<article>`, `<nav>`, `<section>` |
| **Language Tag** | `lang="de-CH"` im HTML-Root |
| **Meta Descriptions** | Einzigartig pro Seite mit Krankheitsname, ICD-Code, Medikamenten |

## Medizinischer Disclaimer

⚠️ **Diese Anwendung dient ausschliesslich zu Informationszwecken und ersetzt keine ärztliche Beratung, Diagnose oder Behandlung.** Die Informationen basieren auf allgemein verfügbarem medizinischem Wissen und gängigen europäischen/schweizerischen Leitlinien.

## Lizenz

MIT
